import { IBaseService } from './i.base.service'
import { CustomBaseEntity } from './custom-base.entity'
import { EntityRepository } from '@mikro-orm/postgresql'
import { FilterQuery } from '@mikro-orm/core'

export class BaseService<T extends CustomBaseEntity>
    implements IBaseService<T>
{
    protected readonly repository: EntityRepository<any>

    constructor(repository: EntityRepository<T>) {
        this.repository = repository
    }

    find(options: {
        where?: FilterQuery<T>
        withDeleted?: boolean
    }): Promise<T[]> {
        return this.repository.find(options.where, {
            limit: 50,
            filters: {
                softDelete: {
                    getAll: options.withDeleted
                }
            }
        })
    }

    findOnlyDeletedAndCount(where?: FilterQuery<T>): Promise<[T[], number]> {
        return this.repository.findAndCount(where, {
            filters: {
                softDelete: {
                    getOnlyDeleted: true
                }
            }
        })
    }

    findAndCount(options: {
        where?: FilterQuery<T>
        withDeleted?: boolean
    }): Promise<[T[], number]> {
        return this.repository.findAndCount(options.where, {
            limit: 50,
            filters: {
                softDelete: {
                    getAll: options.withDeleted
                }
            }
        })
    }

    findById(id: any, withDeleted?: boolean): Promise<T> {
        return this.repository.findOne(
            { id },
            {
                filters: {
                    softDelete: {
                        getAll: withDeleted
                    }
                }
            }
        )
    }

    searchAllFields(
        pattern: string,
        withDeleted?: boolean
    ): Promise<[T[], number]> {
        return this.repository
            .createQueryBuilder('e')
            .where(`e::text ILIKE '%${pattern}%'`)
            .andWhere(`${withDeleted ? 'TRUE' : 'deleted_at IS NULL'}`)
            .getResult()
            .then((res) => {
                return [res, res.length]
            })
    }

    // findByIds(ids: EntityId[], relations?: string[]): Promise<T[]> {
    //     return this.repository.findBy({ iso2: In(ids) })
    // }

    save(data: any): Promise<T> {
        const createdData: T = this.repository.create(data)
        return this.repository
            .persistAndFlush(createdData)
            .then(() => createdData)
            .catch((error) => {
                throw new Error(error)
            })
    }

    // async update(id: string, data: any, relations?: string[]): Promise<T> {
    //     await this.repository.update(id, { ...data })
    //     return this.findById(id)
    // }

    async delete(id: any): Promise<Boolean> {
        const foundEntity: T = await this.repository.findOneOrFail({ id })
        return this.repository
            .removeAndFlush(foundEntity)
            .then(() => true)
            .catch((error) => {
                throw new Error(error)
            })
    }

    async softDelete(id: any): Promise<Boolean> {
        const foundEntity: T = await this.repository.findOneOrFail({ id })
        foundEntity.deletedAt = new Date()
        return this.repository
            .persistAndFlush(foundEntity)
            .then(() => true)
            .catch((error) => {
                throw new Error(error)
            })
    }

    async restore(id: any): Promise<T> {
        const foundEntity: T = await this.repository.findOneOrFail(
            { id },
            {
                filters: {
                    softDelete: {
                        getOnlyDeleted: true
                    }
                }
            }
        )
        foundEntity.deletedAt = null
        return this.repository
            .persistAndFlush(foundEntity)
            .then(() => foundEntity)
            .catch((error) => {
                throw new Error(error)
            })
    }
}
