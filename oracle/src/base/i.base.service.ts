import { FilterQuery } from '@mikro-orm/core'

export interface IBaseService<T> {
    find(options: {
        where?: FilterQuery<T>
        withDeleted?: boolean
    }): Promise<T[]>

    findOnlyDeletedAndCount(where?: FilterQuery<T>): Promise<[T[], number]>

    findAndCount(options: {
        where?: FilterQuery<T>
        withDeleted?: boolean
    }): Promise<[T[], number]>

    findById(id: any, withDeleted?: boolean): Promise<T>

    searchAllFields(
        pattern: string,
        withDeleted?: boolean
    ): Promise<[T[], number]>

    // findByIds(ids: [EntityId], keyColumn: string, relations?: string[]): Promise<T[]>

    save(data: any): Promise<T>

    // update(id: string, data: any, relations?: string[]): Promise<T>

    delete(id: any): Promise<any>

    softDelete(id: any): Promise<Boolean>

    restore(id: any): Promise<T>
}
