import { Prisma } from '@prisma/client'

type IUser = Prisma.UserGetPayload<{
    include: {
        address: true
    }
}>

export {
    IUser
}