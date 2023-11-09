import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable
} from 'o1js';


import { DynamicArray } from '../lib/dynamicArray';
//Size where I don't get timeout erros in test, to improve...
export const sequenceStandardSize = 20 
export class SequenceFieldArray extends DynamicArray(Field, sequenceStandardSize) {}

export class SegmentVerifier extends SmartContract {
  @state(Field) geneHash = State<Field>();
  //store dna tree
  @state(Field) dnaTree = State<Field>();

  init() {
    super.init();
    this.geneHash.set(Field(0));
  }

  @method update(newGeneHash: Field) {
    this.geneHash.set(newGeneHash);
  }

  @method verifySegment(prefix: SequenceFieldArray,  suffix: SequenceFieldArray,  gene: SequenceFieldArray,   dna: SequenceFieldArray ) {
   
    const stateGeneHash = this.geneHash.getAndAssertEquals();
    stateGeneHash.assertEquals(gene.hash());
    const concatenatedHash = prefix.concat(gene).concat(suffix).hash();
    const dnaHash = dna.hash();
    Provable.log(prefix.concat(gene).concat(suffix).get(Field(10)))
    dnaHash.assertEquals(concatenatedHash);
  }
}
