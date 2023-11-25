//https://www.hl7.org/fhir/documentreference.html
import {
  Struct,
  Field,
  CircuitString,
  Encryption,
  MerkleMap,
  Character,
  PublicKey,
} from 'o1js';
import fs from 'fs';
import crypto from 'crypto';
import { encode as base58Encode } from 'bs58';
import { EncryptedCircuitString } from '../customTypes/encryptedCircuitString';

interface DocumentReferenceInitArgs {
  resourceType: CircuitString;
  identifier: CircuitString;
  id: Field;
}
interface IDocumentReference {
  resourceType: CircuitString;
  identifier: CircuitString;
  id: Field;
}
export class DocumentReference extends Struct({
  resourceType: CircuitString,
  identifier: CircuitString,
  id: Field,
}) {
  public encryptedIdentifier: EncryptedCircuitString;
  private constructor(initArgs: DocumentReferenceInitArgs) {
    super(initArgs);
  }

  static async init(
    filePath: string,
    fileType: string
  ): Promise<DocumentReference> {
    const data = await fs.promises.readFile(filePath);
    const hash = crypto.createHash('sha256').update(data).digest();
    const encodedHash = base58Encode(hash);

    return new DocumentReference({
      resourceType: CircuitString.fromString('DocumentReference'),
      identifier: CircuitString.fromString(encodedHash),
      id: Field.random(),
    });
  }

  public encryptIdentifier(publicKey: PublicKey) {
    const encryptedIdentifier = Encryption.encrypt(
      this.identifier.toFields(),
      publicKey
    );

    this.encryptedIdentifier = EncryptedCircuitString.from(
      encryptedIdentifier.cipherText
    );
  }
}
