import {
  Struct,
  Field,
  CircuitString,
  Encryption,
  PublicKey,
  PrivateKey,
  Character,
} from 'o1js';
import { Observation, Quantity, Identifier } from 'fhir/r4';
import { CipherText } from '../customTypes/cipherText';
//TODO: move to uuidv4 when CircuitString is made extendable
//import { Uuidv4 } from '../customTypes/uuidv4';

interface ZkObservationInitArgs {
  resourceType: CircuitString;
  //TODO: move to uuidv4 when CircuitString is made extendable
  identifier: CircuitString;
  code: CircuitString;
  status: CircuitString;
  subject: CircuitString;
  valueQuantityCode: CircuitString;
  valueQuantityValue: CircuitString;
  effectiveDateTime: Field;
  patientId: Field;
}

//TODO: implement nested struct
export class ZkQuantity extends Struct({}) {
  value: CircuitString;
  code: CircuitString;
}

export class ZkObservation extends Struct({
  resourceType: CircuitString,
  identifier: CircuitString,
  code: CircuitString,
  status: CircuitString,
  subject: CircuitString,
  //NOTE: nested struct creates issues w/ typescript. work later on fixing this to allow nesting
  valueQuantityCode: CircuitString,
  valueQuantityValue: CircuitString,
  effectiveDateTime: Field,
  patientId: Field,
}) {
  public encryptedValue: CipherText;
  public encryptedSubject: CipherText;

  private constructor(initArgs: ZkObservationInitArgs) {
    super(initArgs);
  }

  static async init(rawData: Observation): Promise<ZkObservation> {
    // Extract and process FHIR Observation data
    const resourceType = CircuitString.fromString('Observation');

    //we assume that the identifier is a uuidv4
    const identifier = CircuitString.fromString(
      rawData.identifier?.toString() || ''
    );
    const code = CircuitString.fromString(
      rawData.code?.coding?.[0].code?.toString() || ''
    );
    const status = CircuitString.fromString(rawData.status || '');

    const subject = CircuitString.fromString(rawData.subject?.reference || '');
    const valueQuantityValue = CircuitString.fromString(
      rawData.valueQuantity?.value?.toString() || ''
    );
    const valueQuantityCode = CircuitString.fromString(
      rawData.valueQuantity?.code?.toString() || ''
    );

    const patientIdString = rawData.subject?.reference?.split('/')[1] || '';
    const patientId = Field(parseInt(patientIdString));
    const effectiveDateTime = Field(
      Date.parse(rawData.effectiveDateTime || '')
    );

    return new ZkObservation({
      resourceType,
      identifier,
      code,
      status,
      subject,
      valueQuantityValue,
      valueQuantityCode,
      effectiveDateTime,
      patientId,
    });
  }

  // Encrypt sensitive values
  public encryptSensitiveValues(publicKey: PublicKey) {
    this.encryptedValue = Encryption.encrypt(this.value.toFields(), publicKey);
    this.encryptedSubject = Encryption.encrypt(
      this.subject.toFields(),
      publicKey
    );
  }

  // Decrypt sensitive values
  public decryptSensitiveValues(privateKey: PrivateKey): {
    valueData: string;
    subject: string;
  } {
    let valueData = ZkObservation._decryptValue(
      privateKey,
      this.encryptedValue
    ).toString();
    let subject = ZkObservation._decryptValue(
      privateKey,
      this.encryptedSubject
    ).toString();
    return { valueData, subject };
  }

  //TODO: add elgamal encryption for valueQuantityValue for some types (e.g. weight)

  private static _decryptValue(
    privateKey: PrivateKey,
    encryptedValue: CipherText
  ): CircuitString {
    const decryptedValue: Field[] = Encryption.decrypt(
      encryptedValue,
      privateKey
    );
    const characters = decryptedValue.map((field) =>
      Character.fromFields([field])
    );
    return CircuitString.fromCharacters(characters);
  }

  public reencryptAndSign(privateKey: PrivateKey, publicKey: PublicKey) {
    const decryptedValue = ZkObservation._decryptValue(
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

// Usage example:
// const zkObservation = await ZkObservation.init(observationData);
// zkObservation.encryptSensitiveValues(publicKey);
