import {
  dnaBaseToField,
  constructMerkleMapForDNA,
} from "../utils/dnaBaseToField";
import { DNAStruct } from "../dna/struct";
import { Field } from "o1js";
import { expect } from "bun:test";

describe("dnaBaseToField", () => {
  test("should convert ATCG to a field array", () => {
    const dnaString = "ATCG";
    const expectedFieldArray = [0, 3, 1, 2].map((val) => new Field(val));

    const result = [...dnaString].map((base) => dnaBaseToField(base));
    console.log(result[2].value);
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
    const DNA = new DNAStruct(dnaString);
    // console.log(DNA.hash());
    console.log(DNA.merkleTree().getRoot().toString());
  });
  test("verfiy locus 2 of merkle tree", () => {
    // Usage example
    const dnaString = "ATCG";
    const DNA = new DNAStruct(dnaString);

    const locus2 = dnaString[1];
    const locus2Field = dnaBaseToField(locus2);

    expect(DNA.merkleTree().get(Field(1)).toString()).toEqual(
      locus2Field.toString()
    );
  });
});
