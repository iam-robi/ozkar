import { ZKConsent } from '../src/resource/consent';
import { ZKDocument } from '../src/resource/document';

import { Field, CircuitString, Character, PrivateKey, Signature } from 'o1js';

describe('Lib Testing', () => {
  let account1: PrivateKey;
  let account2: PrivateKey;

  beforeAll(async () => {
    account1 = PrivateKey.random();
    account2 = PrivateKey.random();
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  it('creates zkdocument and sign consent', async () => {
    const doc = await ZKDocument.init(
      'tests/data/sampleagreement.json',
      'json'
    );

    const consentMetadata = await ZKDocument.init(
      'tests/data/samplemetadata.json',
      'json'
    );
    const publicKey1 = account1.toPublicKey().toBase58();
    const publicKey2 = account1.toPublicKey().toBase58();

    const consent = await ZKConsent.init(
      doc.cid.toString(),
      account1.toPublicKey()
    );
  });
});
