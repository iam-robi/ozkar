import { Struct, Field, Circuit, CircuitString, Poseidon } from "o1js";
import {
  dnaBaseToField,
  constructMerkleMapForDNA,
} from "../utils/dnaBaseToField";
// Step 1: Create an Interface for DNAStruct

export class ZKSeq extends Struct({
  dna: CircuitString,
}) {
  constructor(dnaString: string) {
    super({ dna: dnaString });
  }
  toFields() {
    return [...this.dna].map((base) => dnaBaseToField(base));
  }
  hash() {
    return Poseidon.hash(this.toFields());
  }

  merkleTree() {
    // Usage example
    const dnaTree = constructMerkleMapForDNA(this.dna); // Or any other variable-length DNA string
    return dnaTree;
    // This would give the first leaf of the Merkle tree
  }
  //TODO: make merkle tree get nucleid acid at position x, get reverse complement
}
