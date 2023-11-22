import { CircuitString } from "o1js";

import fs from "fs";
import crypto from "crypto";
import { encode as base58Encode } from "bs58";

const file = "./ipfs/example.json";

// Read the file
fs.readFile(file, (err, data) => {
  if (err) throw err;

  // Hash the file content
  const hash = crypto.createHash("sha256").update(data).digest();

  // Encode hash in base58 (like IPFS does)
  const encodedHash = base58Encode(hash);

  console.log("Encoded Hash:", CircuitString.fromString(encodedHash));
});
