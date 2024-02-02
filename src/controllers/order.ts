import { Request, Response } from 'express'
import currentUser from '../lib/utils/getCurrentUser'
import { orderParams } from '../lib/validations/order'
import prisma from '../models/order'

const create = async (req: Request, res: Response) => {
    try {
        const user = await currentUser(req)
        if (!user) return res.status(401).json({ error: "Unable to find the user" })

        const orderRequest = orderParams.safeParse(req.body)
        if (!orderRequest.success) {
            return res.status(422).json({ error: "Unable to create order" })
        }
        const orderDetails = orderRequest.data.order;

        const order = await prisma.order.add(user.id, orderDetails)
        if (!order) {
            return res.status(422).json({ error: "Unable to create order" })
        }
        res.status(201).json({ order: order })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to create order' })
    }
}

const index = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })

    const orders = await prisma.order.all(user.id)
    res.status(200).json({ orders: orders })
}

const update = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })

}

const show = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })
    const order_id = parseInt(req.params.id);
    console.log(order_id)
    const order = await prisma.order.find_by(order_id)

    if (!order) return res.status(422).json({ error: "Unable to find the order" })
    res.json({ order: order })
}

const destroy = async (req: Request, res: Response) => {
    const user = await currentUser(req)
    if (!user) return res.status(422).json({ error: "Unable to find the user" })


}

export {
    create,
    index,
    show,
    destroy,
    update
}

//if purchase Type is team
// create team entry
//list customers -> /join_teams -> show customers whose orderStatus is orderPlaced 