/**
 * Represents a nucleotide base in bioinformatics.
 *
 * A - Adenine: One of the four primary nucleotides in DNA.
 * C - Cytosine: One of the four primary nucleotides in DNA.
 * G - Guanine: One of the four primary nucleotides in DNA.
 * T - Thymine: One of the four primary nucleotides in DNA.
 * U - Uracil: A nucleotide in RNA that replaces Thymine found in DNA.
 * N - Any/Unknown: Used to represent an unknown or any nucleotide.
 * R - A or G (purines)
 * Y - C, T, or U (pyrimidines)
 * K - G, T, or U (keto)
 * M - A or C (amino)
 * S - C or G (strong)
 * W - A, T, or U (weak)
 * B - Not A (C, G, T, or U)
 * D - Not C (A, G, T, or U)
 * H - Not G (A, C, T, or U)
 * V - Not T or U (A, C, or G)
 */

export type DNABase =
  | "A"
  | "C"
  | "G"
  | "T"
  | "U"
  | "N"
  | "R"
  | "Y"
  | "K"
  | "M"
  | "S"
  | "W"
  | "B"
  | "D"
  | "H"
  | "V";

export type DNAString = DNABase[];
