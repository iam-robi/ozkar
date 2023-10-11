import { dnaBaseToField } from "../utils/dnaBaseToField";
import { Field } from "o1js";

describe("dnaBaseToField", () => {
  test("should convert ATCG to a field array", () => {
    const dnaString = "ATCG";
    const expectedFieldArray = [0, 3, 1, 2].map((val) => new Field(val));

    const result = [...dnaString].map((base) => dnaBaseToField(base));
    expect(result).toEqual(expectedFieldArray);
  });
});
