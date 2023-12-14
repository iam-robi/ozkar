import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class TrainingDataInput {
  @Field(() => String, {
    description: 'SHA3-256 hash of JSON string of input data used',
  })
  hashedInputData: string;
  @Field(() => String, {
    description: 'SHA3-256 hash of JSON string of output data used',
  })
  hashedOutputData: string;
}
