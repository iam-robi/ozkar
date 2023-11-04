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
  Poseidon,
  CircuitString,
  Int64,
} from 'o1js';

import { ZKSeq2 } from '../lib/dna';

export class SegmentVerifier extends SmartContract {
  @state(Field) geneHash = State<Field>();
  //store dna tree
  @state(Field) dnaTree = State<Field>();

  init() {
    super.init();
    this.geneHash.set(Field(0));
  }

  @method update(newGeneHash: Field) {
    const currentState = this.geneHash.getAndAssertEquals();
    this.geneHash.set(newGeneHash);
  }

  // @method verify(prefix: ZKSeq2, suffix: ZKSeq2, gene: ZKSeq2, dna: ZKSeq2) {
  //   let prefixHash = prefix.seq.hash();
  //   const stateGene = this.geneHash.getAndAssertEquals();
  //   stateGene.assertEquals(gene.seq.hash());

  //   const composedArray = [
  //     ...prefix.seq.toFields().slice(0, prefix.seqLength),
  //     ...gene.seq.toFields().slice(0, gene.seqLength),
  //     ...suffix.seq.toFields().slice(0, suffix.seqLength),
  //   ];

  //   let dnaFields = dna.seq.toFields().slice(0, dna.seqLength);

  //   Poseidon.hash(composedArray).assertEquals(Poseidon.hash(dnaFields));
  // }
}
