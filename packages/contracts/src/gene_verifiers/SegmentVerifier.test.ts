import { SegmentVerifier } from './SegmentVerifier';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  CircuitString,
  Poseidon,
  Struct,
  Encoding,
  Int64,
} from 'o1js';
import { dnaBaseToField, ZKSeq } from 'ozkarjs';
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
    zkApp: SegmentVerifier;

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

  it('correctly updates the genehash state on the `Gene Proof` smart contract and verify segment', async () => {
    await localDeploy();
    let gene = new ZKSeq2('ATT');
    let dna = new ZKSeq2('ATCGATTACCG');
    let prefix = new ZKSeq2('ATCG');
    let suffix = new ZKSeq2('ACCG');

    let geneHash = gene.seq.hash();

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(geneHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedGeneHash = zkApp.geneHash.get();
    expect(updatedGeneHash).toEqual(geneHash);

    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verify(prefix, suffix, gene, dna);
    });
    await txn2.prove();
    await txn2.sign([senderKey]).send();
  });
  it('correctly updates the genehash state on the `Gene Proof` smart contract', async () => {
    await localDeploy();

    // const txn2 = await Mina.transaction(senderAccount, () => {
    //   zkApp.verify(prefixHash, suffixHash, fullSeqHash);
    // });
    // await txn.prove();
    // await txn.sign([senderKey]).send();
  });
});
