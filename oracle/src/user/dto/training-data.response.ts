import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class TrainingDataObject {
  @Field(() => String, {
    description: 'SHA3-256 hash of JSON string of input data used',
  })
  hashedInputData: string;
  @Field(() => String, {
    description: 'SHA3-256 hash of JSON string of output data used',
  })
  hashedOutputData: string;
}
