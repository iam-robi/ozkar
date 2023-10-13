import { Struct, Field, Circuit, CircuitString, Poseidon } from "o1js";

// Step 1: Create an Interface for DNAStruct

export class DNAStruct extends Struct({
  dna: CircuitString,
}) {
  hash() {
    return Poseidon.hash(this.dna);
  }
}
