import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
} from 'o1js';
import fs from 'fs';
import crypto from 'crypto';
import { encode as base58Encode } from 'bs58';

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

    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      // Hash the file content
      const hash = crypto.createHash('sha256').update(data).digest();
      // Encode hash in base58 (like IPFS does)
      const encodedHash = base58Encode(hash);
      console.log('Encoded Hash:', CircuitString.fromString(encodedHash));
      this.cid = CircuitString.fromString(encodedHash);
    });
  }
}
