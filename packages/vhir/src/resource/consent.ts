import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
  Circuit,
} from 'o1js';

// export enum ConsentStatusKind {
//   _draft = 0,
//   _proposed = 1,
//   _active = 2,
//   _rejected = 3,
//   _inactive = 4,
//   _enteredInError = 5,
// }

interface ZKConsentInitArgs {
  resourceType: CircuitString;
  consentCid: CircuitString;
  grantor: PublicKey;
  controller: PublicKey;
  dateTime: Field;
  // dateTime: Field,
}
// https://www.hl7.org/fhir/consent.html
//Consent management - particularly privacy consent - is complicated by the fact that consent to share is often itself necessary to protect. The need to protect the privacy of the privacy statement itself competes with the execution of the consent statement. For this reason, it is common to deal with 'consent statements' that are only partial representations of the full consent statement that the patient provided.
export class ZKConsent extends Struct({
  resourceType: CircuitString,
  consentCid: CircuitString,
  //The entity responsible for granting the rights listed in a Consent Directive.
  grantor: PublicKey,
  //The actor that controls/enforces the access according to the consent. Type	Reference(HealthcareService | Organization | Patient | Practitioner)
  controller: PublicKey,
  dateTime: Field,
  // dateTime: Field,
  // cosigner: PublicKey,
  // dateTime: Field,
  // startDate: Field,
  // endDate: Field,
  // publicMeta contains metadata that is public
  // publicMetaCid: CircuitString.fromString(''),
}) {
  private constructor(initArgs: ZKConsentInitArgs) {
    super(initArgs);
  }

  //initiated w/ empty signer
  static async init(
    documentCid: string,
    grantor: PublicKey,
    controller?: PublicKey
  ): Promise<ZKConsent> {
    const date: Field = Field(Date.now());

    if (!controller) {
      controller = PublicKey.empty();
    }
    console.log('cosigner', controller);

    return new ZKConsent({
      resourceType: CircuitString.fromString('Consent'),
      consentCid: CircuitString.fromString(documentCid),
      grantor: grantor,
      controller: controller,
      dateTime: date,
    });
  }
}
