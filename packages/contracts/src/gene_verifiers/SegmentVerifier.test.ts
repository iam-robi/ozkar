import { SegmentVerifier } from './SegmentVerifier';
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  CircuitString,
  Poseidon,
} from 'o1js';
import { dnaBaseToField, ZKSeq } from 'ozkarjs';
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

  it('generates and deploys the `SegmentVerfier` smart contract', async () => {
    await localDeploy();
    const deployedGeneHash = zkApp.geneHash.get();
    expect(deployedGeneHash).toEqual(Field(0));
  });

  it('correctly updates the genehash state on the `Gene Proof` smart contract', async () => {
    await localDeploy();
    let geneSample = 'ATT';
    let geneSeq = new ZKSeq(geneSample);
    let geneHash = geneSeq.hash();

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(geneHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedGeneHash = zkApp.geneHash.get();
    expect(updatedGeneHash).toEqual(geneHash);
  });
  it('correctly updates the genehash state on the `Gene Proof` smart contract', async () => {
    await localDeploy();
    let geneSample = 'ATT';
    let geneSeq = new ZKSeq(geneSample);
    let geneHash = geneSeq.hash();

    let dnaString = 'CGTTTATCGATTTTGATGGCCAC';
    let position = dnaString.indexOf(geneSample);
    let prefix = dnaString.substring(0, position);
    let suffix = dnaString.substring(position + geneSample.length);

    let fullDNASeq = new ZKSeq(dnaString);
    let prefixSeq = new ZKSeq(prefix);
    let suffixSeq = new ZKSeq(suffix);

    let prefixHash = prefixSeq.hash();
    let suffixHash = suffixSeq.hash();
    let fullSeqHash = fullDNASeq.hash();

    // console.log(
    //   prefixSeq.hash(),
    //   geneSeq.hash(),
    //   suffixSeq.hash(),
    //   fullDNASeq.hash()
    // );

    console.log(Poseidon.hash([prefixHash, geneHash, suffixHash]));
    console.log(
      prefix + geneSample + suffix == dnaString,
      prefixSeq.dna + geneSeq.dna + suffixSeq.dna == fullDNASeq.dna,
      fullSeqHash == Poseidon.hash([prefixHash, geneHash, suffixHash])
    );

    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.update(geneHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const txn2 = await Mina.transaction(senderAccount, () => {
      zkApp.verify(prefixHash, suffixHash, fullSeqHash);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });
});
