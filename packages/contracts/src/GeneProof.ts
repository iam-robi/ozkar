import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable,
  UInt32,
} from 'o1js';

import { ZKSeq, DynamicArray } from 'ozkarjs';
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
//import { DynamicArray } from './dynamicArray';
export class FieldArray extends DynamicArray(Field, 8) {}

export class GeneProof extends SmartContract {
  @state(Field) geneHash = State<Field>();
  // @state(Field) dnaSeqSize = State<Field>();

  init() {
    super.init();
    this.geneHash.set(geneHash);
    // this.dnaSeqSize.set(Field(2));
  }

  @method update(newGeneHash: Field) {
    const currentState = this.geneHash.getAndAssertEquals();
    this.geneHash.set(newGeneHash);
  }

  @method verify(dnaSeq: FieldArray, geneSeq: FieldArray) {
    console.log('processing dnaSeq');
    //const dnaSeqSize = this.dnaSeqSize.getAndAssertEquals();
    //console.log('dnaSeqSize', dnaSeqSize);

    for (let i = 0; i < Field(20); i++) {
      let base: Field = dnaSeq.get(i);
      //console.log(base);
    }

    return true;
  }
}
