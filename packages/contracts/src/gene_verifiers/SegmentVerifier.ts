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
} from 'o1js';

import { ZKSeq } from 'ozkarjs';
let geneSample = 'ATT';
export let geneSeq = new ZKSeq(geneSample);
let geneHash = geneSeq.hash();

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

  @method verify(prefixHash: Field, suffixHash: Field, fullSeqHash: Field) {
    const currentGeneHash = this.geneHash.getAndAssertEquals();
    const rebuiltHash = Poseidon.hash([
      prefixHash,
      currentGeneHash,
      suffixHash,
    ]);
    rebuiltHash.assertEquals(fullSeqHash);
    //TODO: commit dna to dna tree, dna tree can prove presence of gene in multiple positions as well ( unique hashes of Poseidon.hash(prefixHash, suffixHash))
  }
}
