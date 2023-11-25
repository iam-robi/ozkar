import { DocumentReference } from '../src/resource/document';
import { ZKConsent } from '../src/resource/consent';
import {
  Field,
  CircuitString,
  Character,
  PrivateKey,
  Signature,
  Encryption,
} from 'o1js';

describe('Lib Testing', () => {
  let account1: PrivateKey;
  let account2: PrivateKey;

  beforeAll(async () => {
    account1 = PrivateKey.random();
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  it('creates DocumentReference from document path', async () => {
    const expectedCid = 'J1SEmUgGejuHTLMwcL5SwC9j9QA31ENRbyLA46FUyDFm';
    const doc = await DocumentReference.init(
      'tests/data/sampleprotocol.pdf',
      'pdf'
    );
    expect(expectedCid).toEqual(doc.identifier.toString());
  });

  it('correctly encrypt identifier', async () => {
    const expectedCid = 'J1SEmUgGejuHTLMwcL5SwC9j9QA31ENRbyLA46FUyDFm';
    const doc = await DocumentReference.init(
      'tests/data/sampleprotocol.pdf',
      'pdf'
    );
    expect(doc.encryptedIdentifier).toEqual(undefined);
    doc.encryptIdentifier(account1.toPublicKey());
    // expect(doc.encryptedIdentifier.maxLength()).toEqual(129);

    const decryptedIdentifier = doc.decryptIdentifier(account1);

    expect(decryptedIdentifier).toEqual(expectedCid);
  });
});
