import { Field, SmartContract, state, State, method } from 'o1js';

import { ZKSeq } from 'ozkarjs';
let gene = 'ATT';
let geneSeq = new ZKSeq(gene);
let geneHash = geneSeq.hash();
/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class GeneProof extends SmartContract {
  @state(Field) geneHash = State<Field>();

  init() {
    super.init();
    this.geneHash.set(geneHash);
  }

  @method update(newGeneHash: Field) {
    const currentState = this.geneHash.getAndAssertEquals();
    this.geneHash.set(newGeneHash);
    // for (let i = 0; i < 5; i++) {
    //   console.log('updating', i);
    // }
  }

  @method verify(dnaSeq: Field, geneSeq: Field) {
    console.log('heeeey', dnaSeq);
  }
}
