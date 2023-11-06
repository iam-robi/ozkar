import { BruteForceVerifier } from './BruteForceVerifier';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'o1js';

import { ZKSeq2 } from '../lib/dna';
import {
  SequenceFieldArray,
  PatternFieldArray,
} from './BruteForceVerifier';
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
    zkApp: BruteForceVerifier,
    gene: ZKSeq2,
    dna: ZKSeq2,
    dnaWithVariant: ZKSeq2;

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
    gene = new ZKSeq2('ATTATT');
    dna = new ZKSeq2('ATCGTCAGTGGAATTGATCGTCAGTATTATTG');
    dnaWithVariant = new ZKSeq2('ATCGTCAGTGGAATTGATCGTCAGTATGATTG');
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `BruteForceVerifier` smart contract', async () => {
    await localDeploy();
    const deployedGeneHash = zkApp.geneHash.get();
    expect(deployedGeneHash).toEqual(Field(0));
  });

  it('correctly updates the genehash state on the `Gene Proof` smart contract', async () => {
    await localDeploy();
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(gene.seq.hash());
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    const updatedGeneHash = zkApp.geneHash.get();
    expect(updatedGeneHash).toEqual(gene.seq.hash());
  });
  it('correctly verifies presence of gene in dna sequence', async () => {
    await localDeploy();
    // verify transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(gene.seq.hash());
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verify(
        SequenceFieldArray.from(dna.fieldList),
        PatternFieldArray.from(gene.fieldList)
      );
    });

    await txn2.prove();
    await txn2.sign([senderKey]).send();
  });
  it('correctly proove mutated gene', async () => {
    await localDeploy();
    // verify transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(gene.seq.hash());
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verifyMutation(
        SequenceFieldArray.from(dnaWithVariant.fieldList),
        PatternFieldArray.from(gene.fieldList)
      );
    });

    await txn2.prove();
    await txn2.sign([senderKey]).send();
  });
});
