import { Struct, Field, CircuitString, MerkleMap, Character } from 'o1js';

// If MerkleMap is a class, make sure you're using it correctly
// Confirm the correct usage with the o1js documentation

export class ZKSeq2 extends Struct({
  seq: CircuitString,
  seqLength: Field,
  // Specify the type for merkleMap; if it's a class, you might not include it here but instantiate it within the constructor
}) {
  merkleMap: MerkleMap; // Add the MerkleMap property to the class directly

  constructor(seqString: string) {
    super({
      seq: CircuitString.fromString(seqString),
      seqLength: Field(seqString.length),
      // Do not include merkleMap here if it's not part of the Struct definition
    });

    // Construct the MerkleMap instance within the constructor
    this.merkleMap = new MerkleMap();
    [...seqString].forEach((base, index) => {
      const fieldVal = Character.fromString(base);
      this.merkleMap.set(Field(index), fieldVal.toField());
    });
  }

  // Additional methods...
}
