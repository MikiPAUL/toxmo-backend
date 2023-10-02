import {z} from 'zod'

const categoryParams = z.object({
    category: z.object({
    categoryName: z.string()
    })
})

export {
    categoryParams
}