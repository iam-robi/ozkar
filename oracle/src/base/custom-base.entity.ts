import { EntitySchema } from '@mikro-orm/core'

export interface CustomBaseEntity {
    id: string
    deletedAt?: Date
}

export const schema = new EntitySchema<CustomBaseEntity>({
    name: 'CustomBaseEntity',
    abstract: true,
    properties: {
        id: { type: 'string', primary: true },
        deletedAt: { type: 'date' }
    }
})
