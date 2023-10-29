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
let geneLength = geneSample.length;

export let geneSeq = new ZKSeq(geneSample);
let geneHash = geneSeq.hash();
let geneFieldArray = geneSeq.toFieldArray();
export class GeneFieldArray extends DynamicArray(Field, geneLength) {}

//sample size will have to be same max length
let dnaSample = 'ATTTTGATGGCCAC';
let dnaLength = dnaSample.length;
export let dnaSeq = new ZKSeq(dnaSample);
let dnaFieldArray = dnaSeq.toFieldArray();
export class DnaFieldArray extends DynamicArray(Field, dnaLength) {}

export class GeneProof extends SmartContract {
  @state(Field) geneHash = State<Field>();
  @state(Field) dnaSeqSize = State<Field>();
  @state(Field) geneSeqSize = State<Field>();

  init() {
    super.init();
    this.geneHash.set(geneHash);
    this.dnaSeqSize.set(Field(dnaLength));
  }

  @method update(newGeneHash: Field) {
    const currentState = this.geneHash.getAndAssertEquals();
    this.geneHash.set(newGeneHash);
  }

  @method verify(dnaSeq: DnaFieldArray, geneSeq: GeneFieldArray) {
    let dnaSeqSize = dnaSeq.maxLength();
    let geneSeqSize = geneSeq.maxLength();
    let loopSize = dnaSeqSize - geneSeqSize + 1;
    let geneFound = Field(0);
    Field(loopSize).assertGreaterThan(0);
    Provable.log(loopSize);

    for (let i = 0; i < loopSize; i++) {
      let base: Field = dnaSeq.get(Field(i));

      let matchCount: Field = Field(0);
      for (let j = 0; j < geneSeqSize; j++) {
        let geneBase: Field = geneSeq.get(Field(j));
        let index: Field = Field(i + j);
        let dnaBase: Field = dnaSeq.get(index);

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

  //TODO: prove presence of gene variant with parameter variant limit , variant range (ie: presence of a variant in a specific range)
  @method verifyMutation(dnaSeq: DnaFieldArray, geneSeq: GeneFieldArray) {
    let dnaSeqSize = dnaSeq.maxLength();
    let geneSeqSize = geneSeq.maxLength();
    let loopSize = dnaSeqSize - geneSeqSize + 1;
    let variantFound = Field(0);
    Field(loopSize).assertGreaterThan(0);
    Provable.log(loopSize);

    //for now we only look for SNPs
    let variantMaxSize = Field(1);

    for (let i = 0; i < loopSize; i++) {
      let base: Field = dnaSeq.get(Field(i));

      let matchCount: Field = Field(0);
      let variantCount: Field = Field(0);
      for (let j = 0; j < geneSeqSize; j++) {
        let geneBase: Field = geneSeq.get(Field(j));
        let index: Field = Field(i + j);
        let dnaBase: Field = dnaSeq.get(index);

        matchCount = Provable.if(
          dnaBase.equals(geneBase),
          matchCount.add(1),
          matchCount
        );

        //TODO: if we do fixed size array we will have to account for trailing Fields (value of 0?)
        variantCount = Provable.if(
          dnaBase.equals(geneBase),
          variantCount,
          variantCount.add(1)
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

      //TODO: option for proximity score, gee
      variantFound = Provable.if(
        matchCount.greaterThanOrEqual(
          Field(geneSeq.maxLength()).sub(variantMaxSize)
        ) && variantCount.greaterThanOrEqual(Field(0)),
        variantCount.add(1),
        variantCount.add(0)
      );

      Provable.log('variantFound', variantFound);

      variantFound.assertGreaterThan(0);
    }
  }
}
