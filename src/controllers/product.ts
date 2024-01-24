import { NextFunction, Request, Response } from "express"
import prisma from "../models/product";
import * as sellerPrisma from "../models/seller";
import { productParams } from "../lib/validations/product"
import currentUser from "../lib/utils/getCurrentUser";
import IProduct from "seller";
import uploadImage from "../services/uploadImage";

interface HandleRequest extends Request {
    params: {
        id: string
    }
}

const index = async (_: Request, res: Response) => {
    const products = await prisma.product.all()
    res.json({ products: products })
}

const show = async (req: HandleRequest, res: Response) => {
    const product_id = parseInt(req.params.id)
    const product = await prisma.product.show(product_id)
    res.json({ product: product })
}

const create = async (req: Request, res: Response) => {
    const createParams = productParams.safeParse(req.body)
    if (!createParams.success) {
        return res.status(422).json({ error: "Unable to create product" })
    }

    const user = await currentUser(req);
    const seller = await sellerPrisma.default.seller.sellerInfo(user.id);

    if (!seller) throw new Error('Invalid Seller')

    const productDetails: IProduct = createParams.data.product;
    console.log({ ...productDetails, sellerId: seller.id })
    const product = await prisma.product.add({ ...productDetails, sellerId: seller.id })
    if (!product) {
        return res.status(422).json({ error: "Unable to create product" })
    }
    res.json({ product: product })
}

const uploadProductImage = async (req: HandleRequest, res: Response) => {
    try {
        const file = req.file as Express.MulterS3.File;
        if (!file) throw new Error('Unable upload image, please try again');
        const productId = parseInt(req.params.id)
        const product = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                imageLink: file.location
            }
        })
        console.log(req.file)
        res.status(200).json({ product: product })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable upload image, please try again' })
    }
}

export {
    index,
    show,
    create,
    uploadProductImage as uploadImage
}