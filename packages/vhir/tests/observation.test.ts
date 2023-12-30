import Client from 'fhir-kit-client';
import { Patient, Observation } from 'fhir/r4';
import { ZkObservation } from '../src/resource/observation';
import {
  CircuitString,
  Field,
  PrivateKey,
  Signature,
  Poseidon,
  Character,
} from 'o1js';
import { parseJSON } from '../src/customTypes/jsonParsing';
import weightObservation from './data/observations/weightdata.json';
import jsontest from './data/jsontest.json';

const fhirClient = new Client({
  baseUrl: 'https://hapi.fhir.org/baseR4',
});

const patientId = '593165';

async function patientData(): Promise<Patient> {
  try {
    // Read the patient data
    let patientResponse = await fhirClient.read({
      resourceType: 'Patient',
      id: patientId,
    });

    // console.log('Patient Data:', patientResponse);
    return patientResponse as Patient;
  } catch (error) {
    // console.log('Error:', error);
    throw error; // Rethrow to handle in calling function
  }
}

async function patientObservations(): Promise<Observation[]> {
  try {
    // Search for observations for the specific patient
    let observationResponse = await fhirClient.search({
      resourceType: 'Observation',
      searchParams: { patient: patientId },
    });

    if (observationResponse.total > 0) {
      //   console.log(
      //     `Found ${observationResponse.total} observations for patient ${patientId}.`
      //   );
      return observationResponse.entry.map((entry) => entry.resource);
    } else {
      //   console.log(`No observations found for patient ${patientId}.`);
      return [];
    }
  } catch (error) {
    console.log('Error:', error);
    throw error; // Rethrow to handle in calling function
  }
}

function extractObservationTypes(observations: Observation[]): string[] {
  return observations
    .map((observation) => {
      // Extracting the code property of the code, if available
      return observation.code?.coding
        ?.map((coding) => `${coding.system} - ${coding.code}`)
        .join(', ');
    })
    .filter((type): type is string => type != null); // Filtering out null or undefined values
}

describe('Patient Observation Processing', () => {
  let patient: Patient;
  let observationList: Observation[];
  let oracleAccount: PrivateKey;

  beforeAll(async () => {
    patient = await patientData();
    observationList = await patientObservations();
    oracleAccount = PrivateKey.random();
  });

  it('correct conversion to field from weight data', async () => {
    const observation: Observation = observationList[0];
    //console.log(observation);
    const zkObservation = await ZkObservation.init(observation);
    const value: CircuitString = zkObservation.valueQuantityValue;
    const code: CircuitString = zkObservation.valueQuantityCode;
    expect(value.toString()).toEqual('123');
    expect(code.toString()).toEqual('kg');
  });
  it('sign json data for observation', async () => {
    const json = parseJSON(JSON.stringify(weightObservation));
    const hash = json.hash();
    const signedHash = Signature.create(oracleAccount, [hash]);
    let verification = false;

    if (signedHash instanceof Signature) {
      const verificationResult = signedHash.verify(
        oracleAccount.toPublicKey(),
        [hash]
      );
      verification = verificationResult.toBoolean();
    }
    expect(verification).toEqual(true);
    expect(hash.toString()).toEqual(
      '2616121661102522665207455087221215423067716202164134624228805941331883865694'
    );

    console.log(json.length.toString());

    //NOTE: improve performance computation of json.key of this task as it is too slow to process a classique observation jso
    //json.key('resourceType').assertEqualString('"Observation"');
  });
});
