import { Field } from 'o1js';
import { DynamicArray } from './dynamicArray';
//Size where I don't get timeout erros in test, to improve...
export class EncryptedCircuitString extends DynamicArray(Field, 129) {}
