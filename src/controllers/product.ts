import { Request, Response } from "express"
import prisma from "../models/product"
import { productParams } from "../lib/validations/product"

interface HandleRequest extends Request{
    params: {
        id: string
    }
}

const index = async (_: Request, res: Response) => {
    const products = await prisma.product.all()
    res.json({products: products})
}

const show = async (req: HandleRequest, res: Response) => {
    const product_id = parseInt(req.params.id)
    const product = await prisma.product.show(product_id)
    res.json({product: product})
}

const create = async (req: Request, res: Response) => {
    const createParams = productParams.safeParse(req.body)
    if(!createParams.success){
        return res.status(422).json({error: "Unable to create product "})
    }
    const productDetails = createParams.data.product
    const product = await prisma.product.add(productDetails)
    if(!product){
        return res.status(422).json({error: "Unable to create product"})
    }
    res.json({product: product})
}

export {
    index,
    show, 
    create
}