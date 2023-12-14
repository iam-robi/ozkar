import { MethodNotAllowedException, Type } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IBaseResolver } from './i.base.resolver'
import { IBaseService } from './i.base.service'
import { BaseListResponse } from './dto/base-list.response'
import { CustomBaseEntity } from './custom-base.entity'

var pluralize = require('pluralize')

enum FunctionName {
    findAll = 'findAll',
    findOne = 'findOne',
    remove = 'remove',
    softRemove = 'softRemove',
    restore = 'restore'
}

type FunctionNameValue = `${FunctionName}`

export function BaseResolver<T extends CustomBaseEntity>(
    entityType: Type<T>,
    listResponseType: ReturnType<typeof BaseListResponse<T>>,
    exceptFunctions?: FunctionNameValue[]
): Type<IBaseResolver<T>> {
    @Resolver({ isAbstract: true })
    class BaseResolver implements IBaseResolver<T> {
        constructor(readonly baseService: IBaseService<T>) {}

        @Query(() => listResponseType, {
            name: `${pluralize(entityType.name.toLowerCase())}`
        })
        async findAll(
            @Args('search', {
                type: () => String,
                nullable: true
            })
            search?: string,
            @Args('withDeleted', {
                type: () => Boolean,
                nullable: true
            })
            withDeleted?: boolean
        ) {
            if (
                exceptFunctions &&
                exceptFunctions.length &&
                exceptFunctions.includes(FunctionName.findAll)
            ) {
                throw new MethodNotAllowedException(
                    `This query is not allowed on ${entityType.name} entity`
                )
            }
            if (search && search.length) {
                return this.baseService
                    .searchAllFields(search, withDeleted)
                    .then((res) => {
                        let data = res[0]
                        let totalCount = res[1]
                        return { data, totalCount }
                    })
                    .catch((error) => {
                        throw new Error(error)
                    })
            }
            return this.baseService
                .findAndCount({ withDeleted })
                .then((res) => {
                    let data = res[0]
                    let totalCount = res[1]
                    return { data, totalCount }
                })
                .catch((error) => {
                    throw new Error(error)
                })
        }

        @Query(() => entityType, {
            name: `${entityType.name.toLowerCase()}`,
            nullable: true
        })
        async findOne(
            @Args('id', { type: () => ID }) id: any,
            @Args('withDeleted', {
                type: () => Boolean,
                nullable: true
            })
            withDeleted?: boolean
        ): Promise<T> {
            if (
                exceptFunctions &&
                exceptFunctions.length &&
                exceptFunctions.includes(FunctionName.findOne)
            ) {
                throw new MethodNotAllowedException(
                    `This query is not allowed on ${entityType.name} entity`
                )
            }
            return this.baseService.findById(id, withDeleted)
        }

        @Mutation(() => Boolean, {
            name: `remove${entityType.name}`
        })
        async delete(
            @Args('id', { type: () => ID }) id: any
        ): Promise<Boolean> {
            if (
                exceptFunctions &&
                exceptFunctions.length &&
                exceptFunctions.includes(FunctionName.remove)
            ) {
                throw new MethodNotAllowedException(
                    `This mutation is not allowed on ${entityType.name} entity`
                )
            }
            return await this.baseService.delete(id)
        }

        @Mutation(() => Boolean, { name: `softRemove${entityType.name}` })
        async softDelete(
            @Args('id', { type: () => ID }) id: any
        ): Promise<Boolean> {
            if (
                exceptFunctions &&
                exceptFunctions.length &&
                exceptFunctions.includes(FunctionName.softRemove)
            ) {
                throw new MethodNotAllowedException(
                    `This mutation is not allowed on ${entityType.name} entity`
                )
            }
            return await this.baseService.softDelete(id)
        }

        @Mutation(() => entityType, { name: `restore${entityType.name}` })
        async restore(
            @Args('id', { type: () => ID }) id: any
        ): Promise<T> {
            if (
                exceptFunctions &&
                exceptFunctions.length &&
                exceptFunctions.includes(FunctionName.restore)
            ) {
                throw new MethodNotAllowedException(
                    `This mutation is not allowed on ${entityType.name} entity`
                )
            }
            return await this.baseService.restore(id)
        }
    }

    return BaseResolver as Type<IBaseResolver<T>>
}
