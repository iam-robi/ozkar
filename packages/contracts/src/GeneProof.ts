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

let geneSample = 'ATT';
export let geneSeq = new ZKSeq(geneSample);
let geneHash = geneSeq.hash();
let geneFieldArray = geneSeq.toFieldArray();
export class GeneFieldArray extends DynamicArray(Field, geneSample.length) {}

//sample size will have to be same max length
let dnaSample = 'ATTTTGATGGCCAC';
export let dnaSeq = new ZKSeq(dnaSample);
let dnaFieldArray = dnaSeq.toFieldArray();
export class DnaFieldArray extends DynamicArray(Field, dnaSample.length) {}

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

  @method verify(dnaSeq: DnaFieldArray, geneSeq: GeneFieldArray) {
    let dnaSeqSize = dnaSeq.maxLength();
    let geneSeqSize = geneSeq.maxLength();
    let loopSize: Field = Field(dnaSeqSize - geneSeqSize + 1);
    let geneFound = Field(0);
    loopSize.assertGreaterThan(0);
    Provable.log(loopSize);

    for (let i = 0; i < loopSize; i++) {
      let base: Field = dnaSeq.get(i);

      let matchCount: Field = Field(0);
      for (let j = 0; j < geneSeqSize; j++) {
        let geneBase: Field = geneSeq.get(j);
        let dnaBase: Field = dnaSeq.get(i + j);

        matchCount = Provable.if(
          dnaBase.equals(geneBase),
          matchCount.add(1),
          matchCount
        );

        Provable.log(
          i + j,
          'dnaBase.equals(geneBase)',
          dnaBase.equals(geneBase),
          'matchCount',
          matchCount
        );
        //TODO: stop execution at first unmatched to avoid unecesseraly looping
      }

      geneFound = Provable.if(
        matchCount.equals(geneSeq.maxLength()),
        geneFound.add(1),
        geneFound.add(0)
      );

      Provable.log('geneFound', geneFound);

      geneFound.assertGreaterThan(0);
    }
  }
}
