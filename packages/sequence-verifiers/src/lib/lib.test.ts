import { Field, CircuitString, Character } from 'o1js';

import { ZKSeq } from './dna';

describe('Lib Testing', () => {
  beforeAll(async () => {
    //if (proofsEnabled) await SegmentVerifier.compile();
  });

  // beforeEach(() => {});

  it('creates a hashable circuit string with ZKSeq2', async () => {
    let dna = new ZKSeq('ATT');
    let dnaHash = dna.seq.hash();
    expect(dnaHash).toEqual(CircuitString.fromString('ATT').hash());
  });

  it('creates a MerkleMap', async () => {
    let dna = new ZKSeq('ATCG');
    let merkleMap = dna.merkleMap;
    expect(merkleMap.get(Field(0))).toEqual(
      Character.fromString('A').toField()
    );
  });
});
