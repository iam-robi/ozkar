import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable,
  UInt32,
  Circuit,
  Bool,
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

    let dnaSeqSize = dnaSeq.maxLength();
    let geneSeqSize = geneSeq.maxLength();
    let loopSize = dnaSeqSize - geneSeqSize;
    let geneFound: Bool = false;

    for (let i = 0; i < loopSize; i++) {
      let base: Field = dnaSeq.get(i);
      for (let j = 0; j < geneSeqSize; j++) {
        let geneBase: Field = geneSeq.get(j);
        let dnaBase: Field = dnaSeq.get(i + j);
        let matchCount: Field = Field(0);
        Provable.if(
          dnaBase.equals(geneBase),
          matchCount.add(1),
          matchCount.add(0)
        );

        //TODO: stop execution at first unmatched to avoid unecesseraly looping
        Provable.if(
          matchCount.equals(geneBase.maxLength()),
          () => {
            geneFound = true;
          },
          console.log('not found, keep searching')
        );
      }

      geneFound.assertEquals(true);

      //console.log(base);
    }
  }
}
