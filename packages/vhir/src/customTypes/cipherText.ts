import { Field, Group } from 'o1js';
export type CipherText = {
  publicKey: Group;
  cipherText: Field[];
};
