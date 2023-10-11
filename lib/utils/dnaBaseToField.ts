import { Field } from "o1js";
import { DNABase } from "../types";

export function dnaBaseToField(base: DNABase): Field {
  switch (base) {
    case "A":
      return new Field(0);
    case "C":
      return new Field(1);
    case "G":
      return new Field(2);
    case "T":
      return new Field(3);
    case "U":
      return new Field(4);
    case "N":
      return new Field(5);
    case "R":
      return new Field(6);
    case "Y":
      return new Field(7);
    case "K":
      return new Field(8);
    case "M":
      return new Field(9);
    case "S":
      return new Field(10);
    case "W":
      return new Field(11);
    case "B":
      return new Field(12);
    case "D":
      return new Field(13);
    case "H":
      return new Field(14);
    case "V":
      return new Field(15);
    default:
      throw new Error("Invalid DNA base");
  }
}
