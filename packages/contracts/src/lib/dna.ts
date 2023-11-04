import { Struct, Field, CircuitString, MerkleMap, Character } from 'o1js';
export class ZKSeq2 extends Struct({
  seq: CircuitString,
  seqLength: Field,
}) {
  merkleMap: MerkleMap;
  constructor(seqString: string) {
    super({
      seq: CircuitString.fromString(seqString),
      seqLength: Field(seqString.length),
    });

    this.merkleMap = new MerkleMap();
    [...seqString].forEach((base, index) => {
      const fieldVal = Character.fromString(base);
      this.merkleMap.set(Field(index), fieldVal.toField());
    });
  }
}
