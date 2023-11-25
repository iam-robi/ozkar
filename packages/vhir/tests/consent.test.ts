import { ZKConsent, ConsentSignerKind } from '../src/resource/consent';
//import type { ConsentSignerKind } from '../src/resource/consent';
import { DocumentReference } from '../src/resource/document';

import { Field, CircuitString, Character, PrivateKey, Signature } from 'o1js';

describe('Lib Testing', () => {
  let grantorAccount: PrivateKey;
  let controllerAccount: PrivateKey;

  beforeAll(async () => {
    grantorAccount = PrivateKey.random();
    controllerAccount = PrivateKey.random();
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  it('creates DocumentReference and a consent without a controller', async () => {
    const doc = await DocumentReference.init(
      'tests/data/sampleagreement.json',
      'json'
    );
    const docCid = doc.identifier.toString();

    const consentMetadata = await DocumentReference.init(
      'tests/data/samplemetadata.json',
      'json'
    );

    //
    const consent = await ZKConsent.init(docCid, grantorAccount.toPublicKey());

    consent.sign(grantorAccount, ConsentSignerKind._grantor);

    const grantorSignature = consent.grantorSignature;
    let verification = false;
    if (grantorSignature instanceof Signature) {
      const verificationResult = grantorSignature.verify(
        grantorAccount.toPublicKey(),
        consent.sourceReference.toFields()
      );
      verification = verificationResult.toBoolean();
    }
    expect(verification).toEqual(true);
  });
});
