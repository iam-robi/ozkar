import Client from 'fhir-kit-client';
import { Patient, Observation } from 'fhir/r4';
import { ZkObservation } from '../src/resource/observation';
import { CircuitString, Field } from 'o1js';
import { parseJSON } from '../src/customTypes/jsonParsing';

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

  beforeAll(async () => {
    patient = await patientData();
    observationList = await patientObservations();
  });

  it('correct conversion to field from weight data', async () => {
    const observation: Observation = observationList[0];
    console.log(observation);
    const zkObservation = await ZkObservation.init(observation);
    const value: CircuitString = zkObservation.valueQuantityValue;
    const code: CircuitString = zkObservation.valueQuantityCode;
    expect(value.toString()).toEqual('123');
    expect(code.toString()).toEqual('kg');
  });
  it('correctly uses json parser to validate resource type', async () => {
    const observation: Observation = observationList[0];
    const json = parseJSON(JSON.stringify(observation));
    console.log(json.key('resourceType'));
    json.key('resourceType').assertEqualString('Observation');
  });
});
