import {
  Field,
  SmartContract,
  state,
  method,
  State,
  Provable,
  UInt32,
  CircuitString,
  Bool,
} from "o1js";

import { ZKSeq } from "../..";

export class BruteForceVerifier extends SmartContract {
  @state(Field) geneHash = State<Field>();

  init() {
    super.init();
    this.geneHash.set(Field(0));
  }

  @method update() {
    const currentState = this.geneHash.getAndAssertEquals();
    //this.geneHash.set(newGeneHash);
  }

  //@method verify(dnaSeq: ZKSeq, geneSeq: ZKSeq) {}
}
