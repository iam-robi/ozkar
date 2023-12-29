import { PrivateKey } from 'o1js';
import { parseJSON } from '../src/customTypes/jsonParsing';
import jsontest from './data/jsontest.json';

describe('use parseJSON', () => {
  let oracleAccount: PrivateKey;

  beforeAll(async () => {
    oracleAccount = PrivateKey.random();
  });

  it('correctly verifies value of a specific key', async () => {
    const json = parseJSON(JSON.stringify(jsontest));
    json.key('value').assertEqualString('"92"');
  });
  test.todo('correctly verifies value of a specific nested key', async () => {
    const json = parseJSON(JSON.stringify(jsontest));
    json.key('nested.value').assertEqualString('"93"');
  });
});
