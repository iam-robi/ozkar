import { Injectable } from '@nestjs/common';
import { PrivateKey, Signature, Field, Encoding, MerkleMap } from 'o1js';

// import { TradingData } from '../exchange/dto/trading-data.response';
// import { TrainingDataInput } from '../user/dto/training-data.input';

@Injectable()
export class SignService {
  constructor() {}

  async minaSign(data: any) {
    const privateKey = PrivateKey.fromBase58(process.env.ORACLE_PVT_KEY);
    const publicKey = privateKey.toPublicKey();

    const dataString = JSON.stringify(data);
    const encodedData = Encoding.stringToFields(dataString);

    const signature = Signature.create(privateKey, encodedData);

    const result = {
      data: data,
      signature: signature.toJSON(),
      publicKey: publicKey.toBase58(),
    };

    return result;
  }
}
