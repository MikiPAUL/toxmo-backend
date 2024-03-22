import { z } from 'zod'

const formTeamParams = z.object({
    team: z.object({
        order_id: z.number(),
        partner_id: z.number()
    })
})

const createTeamParams = z.object({
    team: z.object({
        productId: z.number(),
        quantity: z.number(),
        totalPrice: z.number()
    })
})

export {
    formTeamParams,
    createTeamParams
}