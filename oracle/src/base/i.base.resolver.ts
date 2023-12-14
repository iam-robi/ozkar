import { IBaseService } from './i.base.service'

export interface IBaseResolver<T> {
    readonly baseService: IBaseService<T>

    findAll(search?: string): Promise<any>

    findOne(id: any): Promise<T>

    delete(id: any): Promise<Boolean>

    softDelete(id: any): Promise<Boolean>

    restore(id: any): Promise<T>
}
