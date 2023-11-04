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
  Character,
} from 'o1js';

import { DynamicArray } from '../lib/dynamicArray';

export const sequenceSize = 32;
export const patternSize = 6;

export class SequenceFieldArray extends DynamicArray(Field, sequenceSize) {}
export class PatternFieldArray extends DynamicArray(Field, patternSize) {}
export class BruteForceVerifier extends SmartContract {
  @state(Field) geneHash = State<Field>();

  init() {
    super.init();
    this.geneHash.set(Field(0));
  }

  @method update(newGeneHash: Field) {
    const currentState = this.geneHash.getAndAssertEquals();
    this.geneHash.set(newGeneHash);
  }

  @method verify(dna: SequenceFieldArray, gene: PatternFieldArray) {
    let loopSize = sequenceSize - patternSize + 1;

    let patternFound = Field(0);
    for (let i = 0; i < loopSize; i++) {
      let base: Field = dna.get(Field(i));

      let matchCount: Field = Field(0);
      for (let j = 0; j < patternSize; j++) {
        let patternBase: Field = gene.get(Field(j));
        let index: Field = Field(i + j);
        let sequenceBase: Field = dna.get(Field(index));

        //Provable.log(dnaBase, geneBase, matchCount, i, j);

        matchCount = Provable.if(
          sequenceBase.equals(patternBase),
          matchCount.add(1),
          matchCount
        );
      }

      patternFound = Provable.if(
        matchCount.equals(Field(patternSize)),
        patternFound.add(1),
        patternFound.add(0)
      );
    }
    patternFound.assertGreaterThan(0);
  }

  // @method verifyMutation(dnaSeq: DnaFieldArray, geneSeq: GeneFieldArray) {
  //   let dnaSeqSize = dnaSize;
  //   let geneSeqSize = geneSize;

  //   let loopSize = dnaSeqSize - geneSeqSize + 1;
  //   let variantFound = Field(0);
  //   //Provable.log(loopSize);

  //   //for now we only look for SNPs
  //   let variantMaxSize = Field(1);

  //   for (let i = 0; i < loopSize; i++) {
  //     let base: Field = dnaSeq.get(Field(i));

  //     let matchCount: Field = Field(0);
  //     let variantCount: Field = Field(0);
  //     for (let j = 0; j < geneSeqSize; j++) {
  //       let geneBase: Field = geneSeq.get(Field(j));
  //       let index: Field = Field(i + j);
  //       let dnaBase: Field = dnaSeq.get(index);

  //       matchCount = Provable.if(
  //         dnaBase.equals(geneBase),
  //         matchCount.add(1),
  //         matchCount
  //       );

  //       //TODO: if we do fixed size array we will have to account for trailing Fields (value of 0?)
  //       variantCount = Provable.if(
  //         dnaBase.equals(geneBase),
  //         variantCount,
  //         variantCount.add(1)
  //       );

  //       Provable.log(dnaBase, geneBase, matchCount, variantCount);
  //       // Provable.log(
  //       //   i + j,
  //       //   'dnaBase.equals(geneBase)',
  //       //   dnaBase.equals(geneBase),
  //       //   'matchCount',
  //       //   matchCount
  //       // );
  //       //TODO: stop execution at first unmatched to avoid unecesseraly looping
  //     }

  //     //TODO: option for proximity score, gee
  //     variantFound = Provable.if(
  //       matchCount.equals(Field(geneSize).sub(1)),
  //       variantFound.add(1),
  //       variantFound.add(0)
  //     );

  //     //Provable.log('variantFound', variantFound);
  //   }
  //   Provable.log('variantFound', variantFound);
  //   variantFound.assertGreaterThan(0);
  // }
}
