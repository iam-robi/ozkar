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

interface ZKDocumentInitArgs {
  resourceType: CircuitString;
  cid: CircuitString;
  id: Field;
}
interface IZKDocument {
  resourceType: CircuitString;
  cid: CircuitString;
  id: Field;
}
export class ZKDocument extends Struct({
  resourceType: CircuitString,
  cid: CircuitString,
  id: Field,
}) {
  private constructor(initArgs: ZKDocumentInitArgs) {
    super(initArgs);
  }

  static async init(filePath: string, fileType: string): Promise<ZKDocument> {
    const data = await fs.promises.readFile(filePath);
    const hash = crypto.createHash('sha256').update(data).digest();
    const encodedHash = base58Encode(hash);

    return new ZKDocument({
      resourceType: CircuitString.fromString('Document'),
      cid: CircuitString.fromString(encodedHash),
      id: Field.random(),
    });
  }
}
