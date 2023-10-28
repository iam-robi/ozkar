import {
  Field,
  AccountUpdate,
  fetchAccount,
  PrivateKey,
  Mina,
  PublicKey,
  UInt64,
  Poseidon,
} from 'o1js';

import { GeneProof } from '../src/GeneProof';

let MINA_URL = process.env.MINA_URL || 'https://api.testnet.minaexplorer.com';

// use local blockchain or Berkeley
const useLocal: boolean = false;

const transactionFee = 150_000_000;
