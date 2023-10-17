import { Field, MerkleMap } from "o1js";
import { DNABase } from "../types";
import { ceil, exp, log2 } from "mathjs"; // You'd need to install mathjs

export function dnaBaseToField(base: string): Field {
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

export function dnaStringToFieldArray(dnaString: string): Field[] {
  return [...dnaString].map((base) => dnaBaseToField(base));
}

// Construct the Merkle tree for a DNA string
export function constructMerkleMapForDNA(dnaString: string): MerkleMap {
  //const dnaFields = dnaStringToFieldArray(dnaString);
  const dnaMap = new MerkleMap();

  [...dnaString].forEach((base, index) => {
    const fieldVal = dnaBaseToField(base);
    dnaMap.set(Field(index), fieldVal);
    console.log(index);
  });
  return dnaMap;
}

export function parseFasta(fastaString: string) {
  const sequences = [];

  const splitSequences = fastaString.split(">").slice(1); // Removing the first empty item

  let index = 0; // Initialize index

  for (const seq of splitSequences) {
    const lines = seq.trim().split("\n");
    const description = lines[0];

    // Parse metadata
    const [id, type, assemblyStatus, assemblyID, details] =
      description.split(" ");

    const metadata = {
      id: id,
      type: type.split(":")[1],
      assemblyStatus: assemblyStatus.split(":")[1],
      assemblyID: assemblyID.split(":")[1],
      details: details,
    };

    const sequence = lines.slice(1).join("");

    sequences.push({
      index: index++, // Add index to the sequence object
      metadata: metadata,
      sequence: sequence,
    });
  }

  return sequences;
}
