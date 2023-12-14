import {ObjectType} from "@nestjs/graphql";
import {User} from "../entities/user.entity";
import {Signed} from "../../sign/types";

@ObjectType()
export class SignedUser extends Signed(User) {}
