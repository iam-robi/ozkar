//https://www.hl7.org/fhir/documentreference.html
import {
  Struct,
  Field,
  CircuitString,
  Encryption,
  MerkleMap,
  Character,
  PublicKey,
  PrivateKey,
} from 'o1js';
import fs from 'fs';
import crypto from 'crypto';
import { encode as base58Encode } from 'bs58';
import { EncryptedCircuitString } from '../customTypes/encryptedCircuitString';
import { CipherText } from '../customTypes/cipherText';

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
  public encryptedIdentifier: CipherText;
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
  static async initFromEncryptedIdentifier(
    encryptedIdentifier: CipherText,
    privateKey: PrivateKey
  ): Promise<DocumentReference> {
    return new DocumentReference({
      resourceType: CircuitString.fromString('DocumentReference'),
      identifier: this._decryptIdentifier(privateKey, encryptedIdentifier),
      id: Field.random(),
    });
  }

  public encryptIdentifier(publicKey: PublicKey) {
    this.encryptedIdentifier = Encryption.encrypt(
      this.identifier.toFields(),
      publicKey
    );
  }
  public decryptIdentifier(privateKey: PrivateKey): string {
    return DocumentReference._decryptIdentifier(
      privateKey,
      this.encryptedIdentifier
    ).toString();
  }

  public static _decryptIdentifier(
    privateKey: PrivateKey,
    encryptedIdentifier: CipherText
  ) {
    const decryptedIdentifier: Field[] = Encryption.decrypt(
      encryptedIdentifier,
      privateKey
    );
    const characters = decryptedIdentifier.map((field) =>
      Character.fromFields([field])
    );
    const circuitString = CircuitString.fromCharacters(characters);
    return circuitString;
  }
}
