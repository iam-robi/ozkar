import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable,
  PublicKey,
  MerkleMap,
  MerkleMapWitness,
  Poseidon,
  CircuitString,
  Signature,
} from 'o1js';

const ORACLE_PUBLIC_KEY = process.env.ORACLE_PUBLIC_KEY || '';

export class ObservationShare extends SmartContract {
  @state(PublicKey) oraclePublicKey = State<PublicKey>();
  @state(Field) observationsRootHash = State<Field>();
  @state(Field) observationCount = State<Field>();
  @state(Field) observationsShareListRootHash = State<Field>();

  events = {
    observationShared: Field,
  };

  init() {
    super.init();
    let map = new MerkleMap();
    this.observationsRootHash.set(map.getRoot());
    this.observationCount.set(Field(0));
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
  }

  @method addObservation(
    observationCode: CircuitString,
    observationDateTime: Field,
    value: Field,
    valueCode: CircuitString,
    merkleWitness: MerkleMapWitness,
    signature: Signature
  ) {
    const observationsRoothash = this.observationsRootHash.getAndAssertEquals();
    const oraclePublicKey = this.oraclePublicKey.getAndAssertEquals();
    const observationCount = this.observationCount.getAndAssertEquals();
    const epoch = this.network.timestamp.get();

    const dataHash = Poseidon.hash([
      ...observationCode.toFields(),
      value,
      ...valueCode.toFields(),
      observationDateTime,
    ]);

    const validSignature = signature.verify(oraclePublicKey, [
      ...observationCode.toFields(),
      value,
      ...valueCode.toFields(),
      observationDateTime,
    ]);

    validSignature.assertTrue();

    const [newRoot, _] = merkleWitness.computeRootAndKey(dataHash);
    this.observationsRootHash.set(newRoot);
    this.observationCount.set(observationCount.add(1));

    this.emitEvent('observationShared', epoch);
  }
}
