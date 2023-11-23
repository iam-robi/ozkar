import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
} from 'o1js';

export class ZKDocument extends Struct({
  resourceType: CircuitString,
  cid: CircuitString,
  id: Field,
}) {
  constructor(filePath: String, fileType: String) {
    super({
      resourceType: CircuitString.fromString('Document'),
      cid: CircuitString.fromString(''),
      //build utility to generate random id closer to uuidv4 ( ie random  circuit string ? )
      id: Field.random(),
    });
  }
}
