import assert from 'assert';
import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
  Circuit,
  Signature,
  PrivateKey,
} from 'o1js';

// export enum ConsentStatusKind {
//   _draft = 0,
//   _proposed = 1,
//   _active = 2,
//   _rejected = 3,
//   _inactive = 4,
//   _enteredInError = 5,
// }
// https://www.hl7.org/fhir/consent-definitions.html#Consent

export enum ConsentSignerKind {
  _unknown = 0,
  _grantor = 1,
  _controller = 2,
}

interface ZKConsentInitArgs {
  resourceType: CircuitString;
  documentCid: CircuitString;
  grantor: PublicKey;
  controller: PublicKey;
  dateTime: Field;
  // dateTime: Field,
}
// https://www.hl7.org/fhir/consent.html
//Consent management - particularly privacy consent - is complicated by the fact that consent to share is often itself necessary to protect. The need to protect the privacy of the privacy statement itself competes with the execution of the consent statement. For this reason, it is common to deal with 'consent statements' that are only partial representations of the full consent statement that the patient provided.
export class ZKConsent extends Struct({
  resourceType: CircuitString,
  documentCid: CircuitString,
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
  private grantorSignature: Signature | Field = Field(0);
  private controllerSignature: Signature | Field = Field(0);
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

    return new ZKConsent({
      resourceType: CircuitString.fromString('Consent'),
      documentCid: CircuitString.fromString(documentCid),
      grantor: grantor,
      controller: controller,
      dateTime: date,
    });
  }

  public sign(pvk: PrivateKey, signerKind: ConsentSignerKind): void {
    if (signerKind === ConsentSignerKind._grantor) {
      assert(this.grantor.toBase58() === pvk.toPublicKey().toBase58());
      this.grantorSignature = Signature.create(
        pvk,
        this.documentCid.toFields()
      );
    }
    if (signerKind === ConsentSignerKind._controller) {
      assert(this.controller.toBase58() === pvk.toPublicKey().toBase58());
      this.controllerSignature = Signature.create(
        pvk,
        this.documentCid.toFields()
      );
    }
  }
}
