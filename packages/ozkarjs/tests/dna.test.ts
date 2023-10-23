import {
  dnaBaseToField,
  constructMerkleMapForDNA,
  parseFasta,
} from "../utils/dnaBaseToField";
import { ZKSeq } from "../dna/struct";
import { Field } from "o1js";
import { expect, test, describe } from "bun:test";
import { exp } from "mathjs";

describe("dnaBaseToField", () => {
  test("should convert ATCG to a field array", () => {
    const dnaString = "ATCG";
    const expectedFieldArray = [0, 3, 1, 2].map((val) => new Field(val));

    const result = [...dnaString].map((base) => dnaBaseToField(base));

    expect(result).toEqual(expectedFieldArray);
  });
  test("dna to merkle tree", () => {
    // Usage example
    const dnaTree = constructMerkleMapForDNA("ATCGT"); // Or any other variable-length DNA string
    //console.log(dnaTree.getRoot()); // This would give the root of the Merkle tree
    //console.log(dnaTree.get(Field(0))); // This would give the first leaf of the Merkle tree
  });

  test("create dna struct and get its merkle tree", () => {
    // Usage example
    const dnaString = "ATCG";
    const DNA = new ZKSeq(dnaString);
    // console.log(DNA.hash());
    console.log(DNA.merkleTree().getRoot().toString());
  });
  test("verify locus 2 of merkle tree", () => {
    // Usage example
    const dnaString = "ATCG";
    const DNA = new ZKSeq(dnaString);

    const locus2 = dnaString[1];
    const locus2Field = dnaBaseToField(locus2);

    expect(DNA.merkleTree().get(Field(1)).toString()).toEqual(
      locus2Field.toString()
    );
  });

  test("read fasta and construct DNA", async () => {
    console.log("Current working directory:", process.cwd());
    const txt = Bun.file(
      "./data/Escherichia_coli_w_gca_000184185.ASM18418v1_.dna.toplevel.fa"
    );
    const content = await txt.text();

    const sequences = parseFasta(content);

    console.log("#sequences :", sequences.length);
    for (let seq of sequences) {
      console.log(seq.metadata);
    }

    let dnaSeqSize = 5;
    // we take chromosome sequence as its more likely to contain lacZ gene, for testing we take a short sequence we will have to deal with data size later
    const DNA = new ZKSeq(sequences[0].sequence.slice(0, dnaSeqSize));
    const dnaTree = DNA.merkleTree();

    const fieldArray = DNA.toFieldArray();

    expect(fieldArray.maxLength()).toEqual(dnaSeqSize);
  });

  // test("Dyamic array type", async () => {
  //   class FieldArray extends DynamicArray(Field, 8) {}
  // });
});
