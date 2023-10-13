import {
  dnaBaseToField,
  constructMerkleMapForDNA,
} from "../utils/dnaBaseToField";
import { Field } from "o1js";

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
    console.log(dnaTree.getRoot()); // This would give the root of the Merkle tree
    console.log(dnaTree.get(Field(0))); // This would give the first leaf of the Merkle tree
  });
});
