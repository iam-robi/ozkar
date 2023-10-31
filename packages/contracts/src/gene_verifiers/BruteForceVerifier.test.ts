import {
  BruteForceVerifier,
  dnaSeq,
  geneSeq,
  GeneFieldArray,
  DnaFieldArray,
} from './BruteForceVerifier';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'o1js';
import { dnaBaseToField, ZKSeq } from 'ozkarjs';
/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('BruteForceVerifier', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: BruteForceVerifier;

  beforeAll(async () => {
    if (proofsEnabled) await BruteForceVerifier.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new BruteForceVerifier(zkAppAddress);
  });

  async function localDeploy() {
    // const e = dnaBaseToField('A');
    // console.log('heyeyyy', e);
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `BruteForceVerifier` smart contract', async () => {
    await localDeploy();
    const deployedGeneHash = zkApp.geneHash.get();
    let gene = 'ATT';
    let geneSeq = new ZKSeq(gene);
    let geneHash = geneSeq.hash();
    expect(geneHash).toEqual(deployedGeneHash);
  });

  it('correctly updates the genehash state on the `Gene Proof` smart contract', async () => {
    await localDeploy();
    let geneHash = geneSeq.hash();
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(geneHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedGeneHash = zkApp.geneHash.get();
    expect(updatedGeneHash).toEqual(geneHash);
  });
  it('correctly verifies presence of gene in dna sequence', async () => {
    await localDeploy();
    // verify transaction
    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verify(
        DnaFieldArray.from(dnaSeq.toFields()),
        GeneFieldArray.from(geneSeq.toFields())
      );
    });

    await txn2.prove();
    await txn2.sign([senderKey]).send();
  });
  // it('correctly verifies presence of gene in dna sequence', async () => {
  //   let e = dnaSeq.toFields();
  //   class FieldArray extends DynamicArray(Field, 8) {}
  // });
});
