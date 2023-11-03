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
} from 'o1js';

import { ZKSeq2 } from '../lib/dna';

describe('Lib Testing', () => {
  beforeAll(async () => {
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  beforeEach(() => {});

  it('creates a hashable circuit string with ZKSeq2', async () => {
    let dna = new ZKSeq2('ATT');
    let dnaHash = dna.seq.hash();
    expect(dnaHash).toEqual(CircuitString.fromString('ATT').hash());
  });
});
