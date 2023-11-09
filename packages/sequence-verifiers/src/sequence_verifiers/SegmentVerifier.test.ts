import { SegmentVerifier , SequenceFieldArray } from './SegmentVerifier';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'o1js';
import { ZKSeq2 } from '../lib/dna';
/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('SegmentVerifier', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: SegmentVerifier,
    gene: ZKSeq2,
    dna: ZKSeq2,
    prefix: ZKSeq2,
    suffix: ZKSeq2

  beforeAll(async () => {
    if (proofsEnabled) await SegmentVerifier.compile();
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
    zkApp = new SegmentVerifier(zkAppAddress);
    gene = new ZKSeq2('ATT');
    dna = new ZKSeq2('ATCGATTACCG');
    prefix = new ZKSeq2('ATCG');
    suffix = new ZKSeq2('ACCG');
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `SegmentVerifier` smart contract', async () => {
    await localDeploy();
    const deployedGeneHash = zkApp.geneHash.get();
    expect(deployedGeneHash).toEqual(Field(0));
  });
  it('correctly updates the genehash of verifier and verifies segment', async () => {
    await localDeploy();

    let geneHash:Field = new SequenceFieldArray(gene.fieldList).hash()

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(geneHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedGeneHash = zkApp.geneHash.get();
    expect(updatedGeneHash).toEqual(geneHash);



    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verifySegment( 
       SequenceFieldArray.from(prefix.fieldList),
      
       SequenceFieldArray.from(suffix.fieldList),
    
       SequenceFieldArray.from(gene.fieldList),
       
       SequenceFieldArray.from(dna.fieldList),
       )
    });
    await txn2.prove();
    await txn2.sign([senderKey]).send();
  });

});
