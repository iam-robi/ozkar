import { ObjectType } from '@nestjs/graphql';
import { Signed } from '../../sign/types';
import { TrainingDataObject } from './training-data.response';

@ObjectType()
export default class SignedTrainingData extends Signed(TrainingDataObject) {}
