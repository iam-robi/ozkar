import { Struct, Field, Circuit, CircuitString, Poseidon } from "o1js";
import { dnaBaseToField } from "../utils/dnaBaseToField";
// Step 1: Create an Interface for DNAStruct

export class DNAStruct extends Struct({
  dna: CircuitString,
}) {
  constructor(dnaString: string) {
    console.log("Hello from DNAStruct constructor!", dnaString);
    super({ dna: dnaString });
  }
  toFields() {
    return [...this.dna].map((base) => dnaBaseToField(base));
  }
  hash() {
    return Poseidon.hash(this.toFields());
  }
  //TODO: make merkle tree get nucleid acid at position x, get reverse complement
}
