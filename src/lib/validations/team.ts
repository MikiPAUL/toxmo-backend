import {z} from 'zod'

const formTeamParams = z.object({
    team: z.object({
        order_id: z.number(),
        partner_id: z.number()
    })
})

export {
    formTeamParams
}