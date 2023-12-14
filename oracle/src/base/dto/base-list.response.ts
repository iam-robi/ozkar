import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Type } from '@nestjs/common'
import {IBaseListResponse} from "./i.base-list.response";

export function BaseListResponse<T>(classRef: Type<T>): Type<IBaseListResponse<T>> {
    @ObjectType({ isAbstract: true })
    class BaseListResponseClass implements IBaseListResponse<T>{
        @Field(() => [classRef])
        data: T[]

        @Field(() => Int)
        totalCount: number
    }

    return BaseListResponseClass as Type<IBaseListResponse<T>>
}