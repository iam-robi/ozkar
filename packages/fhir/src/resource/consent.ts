import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
} from 'o1js';

export enum ConsentStatusKind {
  _draft = 0,
  _proposed = 1,
  _active = 2,
  _rejected = 3,
  _inactive = 4,
  _enteredInError = 5,
}

// https://www.hl7.org/fhir/consent.html
//Consent management - particularly privacy consent - is complicated by the fact that consent to share is often itself necessary to protect. The need to protect the privacy of the privacy statement itself competes with the execution of the consent statement. For this reason, it is common to deal with 'consent statements' that are only partial representations of the full consent statement that the patient provided.
export class ZKConsent extends Struct({
  resourceType: CircuitString.fromString('Consent'),
  statusKind: Field,
  id: Field,
  //hash of metadata
  meta: Field,
  patient: PublicKey,
  performer: PublicKey,
  consentStatusKind: Field,
  dateTime: Field,
  startDate: Field,
  endDate: Field,
}) {
  constructor(
    patient: PublicKey,
    performer: PublicKey,
    consentStatusKind: ConsentStatusKind
  ) {
    super({
      resourceType: CircuitString.fromString('Consent'),
      statusKind: Field(0),
      patient: patient,
      id: Field.random(),
      meta: Field(0),
      performer: performer,
      consentStatusKind: Field(consentStatusKind),
      dateTime: Field(new Date().getTime()),
      startDate: Field(0),
      endDate: Field(0),
    });
  }
}
