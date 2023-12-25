import {
  Struct,
  Field,
  CircuitString,
  Encryption,
  MerkleMap,
  Character,
  PublicKey,
  PrivateKey,
  Sign,
  Signature,
} from 'o1js';
import crypto from 'crypto';
import { encode as base58Encode } from 'bs58';
import { EncryptedCircuitString } from '../customTypes/encryptedCircuitString';
import { CipherText } from '../customTypes/cipherText';

interface ObservationInitArgs {
  resourceType: CircuitString;
  identifier: CircuitString;
  status: CircuitString;
  code: CircuitString;
  subject: CircuitString;
  value: CircuitString; // Can represent different data types, depending on observation
}

interface IObservation {
  resourceType: CircuitString;
  identifier: CircuitString;
  status: CircuitString;
  code: CircuitString;
  subject: CircuitString;
  value: CircuitString;
}

//NOTE: should we have a public and private code ?
interface MetadataValues {
  code: string;
  status: string;
}

interface DecryptedSensitiveValues {
  valueData: string;
  subject: string;
}

export class Observation extends Struct({
  resourceType: CircuitString,
  identifier: CircuitString,
  status: CircuitString,
  code: CircuitString,
  subject: CircuitString,
  value: CircuitString,
}) {
  public encryptedValue: CipherText;
  public encryptedSubject: CipherText;

  private constructor(initArgs: ObservationInitArgs) {
    super(initArgs);
  }

  //TODO: process FHIR format for Observation
  //TODO: split to metadata and data ( metadata is public for the app chain )
  static async init(
    valueData: string, // The observation data
    code: string, // The observation code in its most precise form
    status: string, // The observation status
    subject: string // The subject of the observation
  ): Promise<Observation> {
    const hash = crypto
      .createHash('sha256')
      .update(valueData + code + subject)
      .digest();
    const encodedHash = base58Encode(hash);

    return new Observation({
      resourceType: CircuitString.fromString('Observation'),
      identifier: CircuitString.fromString(encodedHash),
      status: CircuitString.fromString(status),
      code: CircuitString.fromString(code),
      subject: CircuitString.fromString(subject),
      value: CircuitString.fromString(valueData),
    });
  }

  public encryptSensitiveValues(publicKey: PublicKey) {
    this.encryptedValue = Encryption.encrypt(this.value.toFields(), publicKey);
    this.encryptedSubject = Encryption.encrypt(
      this.subject.toFields(),
      publicKey
    );
  }

  public decryptSensitiveValues(
    privateKey: PrivateKey
  ): DecryptedSensitiveValues {
    let valueData = Observation._decryptValue(
      privateKey,
      this.encryptedValue
    ).toString();

    let subject = Observation._decryptValue(
      privateKey,
      this.encryptedSubject
    ).toString();

    return { valueData, subject };
  }

  public static _decryptValue(
    privateKey: PrivateKey,
    encryptedValue: CipherText
  ) {
    const decryptedValue: Field[] = Encryption.decrypt(
      encryptedValue,
      privateKey
    );
    const characters = decryptedValue.map((field) =>
      Character.fromFields([field])
    );
    const circuitString = CircuitString.fromCharacters(characters);
    return circuitString;
  }

  public reencryptAndSign(privateKey: PrivateKey, publicKey: PublicKey) {
    const decryptedValue = Observation._decryptValue(
      privateKey,
      this.encryptedValue
    );
    const reencryptedValue = Encryption.encrypt(
      decryptedValue.toFields(),
      publicKey
    );

    //TODO: sign reencrypted value with private key
    return reencryptedValue;
  }
}
