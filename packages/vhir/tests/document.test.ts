import { ZKDocument } from '../src/resource/document';
import { ZKConsent } from '../src/resource/consent';
import { Field, CircuitString, Character, PrivateKey, Signature } from 'o1js';

describe('Lib Testing', () => {
  let account1: PrivateKey;
  let account2: PrivateKey;

  beforeAll(async () => {
    account1 = PrivateKey.random();
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  it('creates zkdocument from document path', async () => {
    const expectedCid = 'J1SEmUgGejuHTLMwcL5SwC9j9QA31ENRbyLA46FUyDFm';
    const doc = await ZKDocument.init('tests/data/sampleprotocol.pdf', 'pdf');
    expect(expectedCid).toEqual(doc.cid.toString());
  });
});
