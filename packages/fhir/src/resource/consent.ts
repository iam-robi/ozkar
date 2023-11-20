import {
  Struct,
  Field,
  CircuitString,
  MerkleMap,
  Character,
  PublicKey,
} from 'o1js';

// export enum ConsentStatusKind {
//   _draft = 'draft',
//   _proposed = 'proposed',
//   _active = 'active',
//   _rejected = 'rejected',
//   _inactive = 'inactive',
//   _enteredInError = 'entered-in-error',
// }

export class ZKConsent extends Struct({
  resourceType: CircuitString.fromString('Consent'),
  statusKind: Field,
  consentingParty: PublicKey,
}) {
  merkleMap: MerkleMap;
  constructor(seqString: string) {
    super({
      resourceType: CircuitString.fromString('Consent'),
      statusKind: Field(0),
      consentingParty: PublicKey.empty(),
    });
  }
}
