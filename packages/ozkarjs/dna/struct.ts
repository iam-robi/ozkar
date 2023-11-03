import { Struct, Field, Circuit, CircuitString, Poseidon } from "o1js";
import {
  dnaBaseToField,
  constructMerkleMapForDNA,
} from "../utils/dnaBaseToField";
// Step 1: Create an Interface for DNAStruct

import { DynamicArray } from "../utils/dynamicArray";
export class ZKSeq extends Struct({
  seq: CircuitString,
}) {
  constructor(seqString: CircuitString) {
    super({ seq: seqString });
  }

  merkleTree() {
    // Usage example
    const dnaTree = constructMerkleMapForDNA(this.seq.toString()); // Or any other variable-length DNA string
    return dnaTree;
    // This would give the first leaf of the Merkle tree
  }

  //TODO: make merkle tree get nucleid acid at position x, get reverse complement
}
