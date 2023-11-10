import {
  BruteForceVerifier,
  SequenceFieldArray,
  PatternFieldArray,
} from './sequence_verifiers/BruteForceVerifier';

import {
  Mina,
  PrivateKey,
  Field,
  PublicKey,
  Account,
  AccountUpdate,
} from 'o1js';
import { ZKSeq } from './lib/dna';

const fee = Number('0.1') * 1e9;
let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
Mina.setActiveInstance(Berkeley);
// to use this test, change this private key to an account which has enough MINA to pay fees
let feePayerKey = PrivateKey.fromBase58(
  process.env.DEPLOYER_PRIVATE_KEY as string
);

const gene = new ZKSeq('ATTATT');
const dna = new ZKSeq('ATCGTCAGTGGAATTGATCGTCAGTATTATTG');
const dnaWithVariant = new ZKSeq('ATCGTCAGTGGAATTGATCGTCAGTATGATTG');
const geneHash = PatternFieldArray.from(gene.fieldList).hash();
const zkAppAddress = PublicKey.fromBase58(
  'B62qpWAr1nJ6WNCZnAUsWPXPAhT9nDNRQAZvuM1vQ6gDjgQKCqCMPxr'
);
let zkApp = new BruteForceVerifier(zkAppAddress);
console.log(`
Private sequence 1: ${dna.seq.toString()}
`);

console.log(`
Private sequence 2 (with variant): ${dna.seq.toString()}
`);

const userOneKey = PrivateKey.fromBase58(
  process.env.USER_ONE_PRIVATE_KEY as string
);
const usertwoKey = PrivateKey.fromBase58(
  process.env.USER_TWO_PRIVATE_KEY as string
);

// compile the contract to create prover keys
console.log('compile the contract...');
await BruteForceVerifier.compile();
console.log('contract compiled');

let sentUpdateTx;
try {
  // call update() and send transaction
  console.log('build transaction and create proof...');

  let tx = await Mina.transaction(
    { sender: feePayerKey.toPublicKey(), fee },
    () => {
      zkApp.update(geneHash);
    }
  );
  await tx.prove();
  console.log('send transaction...');
  sentUpdateTx = await tx.sign([feePayerKey]).send();
} catch (err) {
  console.log(err);
}
if (sentUpdateTx?.hash() !== undefined) {
  console.log(`
  Success! Update transaction sent your zkapp is set up to verify presence of gene ${gene.seq.toString()}.
  https://berkeley.minaexplorer.com/transaction/${sentUpdateTx.hash()}
  `);
}

let sentVerifyTx;
try {
  // call update() and send transaction
  console.log('build transaction and create proof...');

  let tx = await Mina.transaction(
    { sender: userOneKey.toPublicKey(), fee },
    () => {
      zkApp.verify(
        SequenceFieldArray.from(dna.fieldList),
        PatternFieldArray.from(gene.fieldList)
      );
    }
  );
  await tx.prove();
  console.log('send transaction...');
  sentVerifyTx = await tx.sign([userOneKey]).send();
} catch (err) {
  console.log(err);
}
if (sentVerifyTx?.hash() !== undefined) {
  console.log(`
    Success! You successfully verified that the sequence1 contains gene ${gene.seq.toString()}.
    https://berkeley.minaexplorer.com/transaction/${sentVerifyTx.hash()}
    `);
}

let sentVerifyMutationTx;
try {
  // call update() and send transaction
  console.log('build transaction and create proof...');

  let tx = await Mina.transaction(
    { sender: usertwoKey.toPublicKey(), fee },
    () => {
      zkApp.verifyMutation(
        SequenceFieldArray.from(dnaWithVariant.fieldList),
        PatternFieldArray.from(gene.fieldList)
      );
    }
  );
  await tx.prove();
  console.log('send transaction...');
  sentVerifyMutationTx = await tx.sign([usertwoKey]).send();
} catch (err) {
  console.log(err);
}
if (sentVerifyMutationTx?.hash() !== undefined) {
  console.log(`
        Success! You successfully verified that the sequence2 contains a variant of gene ${gene.seq.toString()}.
        https://berkeley.minaexplorer.com/transaction/${sentVerifyMutationTx.hash()}
        `);
}
