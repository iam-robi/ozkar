import { ZKConsent, ConsentSignerKind } from '../src/resource/consent';
//import type { ConsentSignerKind } from '../src/resource/consent';
import { ZKDocument } from '../src/resource/document';

import { Field, CircuitString, Character, PrivateKey, Signature } from 'o1js';

describe('Lib Testing', () => {
  let grantorAccount: PrivateKey;
  let controllerAccount: PrivateKey;

  beforeAll(async () => {
    grantorAccount = PrivateKey.random();
    controllerAccount = PrivateKey.random();
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  it('creates zkdocument and a consent without a controller', async () => {
    const doc = await ZKDocument.init(
      'tests/data/sampleagreement.json',
      'json'
    );
    const docCid = doc.cid.toString();

    const consentMetadata = await ZKDocument.init(
      'tests/data/samplemetadata.json',
      'json'
    );

    //
    const consent = await ZKConsent.init(docCid, grantorAccount.toPublicKey());

    consent.sign(grantorAccount, ConsentSignerKind._grantor);
  });
});
