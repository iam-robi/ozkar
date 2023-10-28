import {
  Field,
  AccountUpdate,
  fetchAccount,
  PrivateKey,
  Mina,
  PublicKey,
  UInt64,
  Poseidon,
} from 'o1js';

import { GeneProof } from '../src/GeneProof';

let MINA_URL = process.env.MINA_URL || 'https://api.testnet.minaexplorer.com';

// use local blockchain or Berkeley
const useLocal: boolean = false;

const transactionFee = 150_000_000;

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
Mina.setActiveInstance(Berkeley);

// to use this test, change this private key to an account which has enough MINA to pay fees
let feePayerKey = PrivateKey.fromBase58(
  process.env.DEPLOYER_PRIVATE_KEY as string
);
console.log(feePayerKey.toPublicKey().toBase58());

let response = await fetchAccount({ publicKey: feePayerKey.toPublicKey() });
if (response.error) throw Error(response.error.statusText);
let { nonce, balance } = response.account;
console.log(`Using fee payer account with nonce ${nonce}, balance ${balance}`);

let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();

let { verificationKey } = await GeneProof.compile();
let zkapp = new GeneProof(zkappAddress);
console.log(`Deploying zkapp for public key ${zkappAddress.toBase58()}.`);

console.log('Sending the transaction...');
let sentTx;
try {
  const txn = await Mina.transaction(
    { sender: feePayerKey.toPublicKey(), fee: transactionFee },
    () => {
      AccountUpdate.fundNewAccount(feePayerKey.toPublicKey());
      zkapp.deploy();
    }
  );
  await txn.prove();
  sentTx = await txn.sign([feePayerKey, zkappKey]).send();
} catch (err) {
  console.log(err);
}

if (sentTx?.hash() !== undefined) {
  console.log(`
  Success! Deploy transaction sent.
  
  Your smart contract will be live as soon
  as the transaction is included in a block:
  https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
  `);
}
// if you want to inspect the transaction, you can print it out:
//console.log(transaction.toGraphqlQuery());

// send the transaction to the graphql endpoint
