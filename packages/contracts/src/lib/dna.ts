import { Struct, Field, Circuit, CircuitString, Poseidon, UInt32 } from 'o1js';

// Step 1: Create an Interface for DNAStruct

export class ZKSeq2 extends Struct({
  seq: CircuitString,
  seqLength: Number,
}) {
  constructor(seqString: string) {
    super({
      seq: CircuitString.fromString(seqString),
      seqLength: seqString.length,
    });
  }

  //   merkleTree() {
  //     // Usage example
  //     const dnaTree = constructMerkleMapForDNA(this.seq.toString()); // Or any other variable-length DNA string
  //     return dnaTree;
  //     // This would give the first leaf of the Merkle tree
  //   }

  //TODO: make merkle tree get nucleid acid at position x, get reverse complement
}
