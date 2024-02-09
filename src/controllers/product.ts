import { Request, Response } from "express"
import prisma from "../models/product";
import * as sellerPrisma from "../models/seller";
import type { Product } from '@prisma/client'
import { productParams, productReviewParams } from "../lib/validations/product"
import currentUser from "../lib/utils/getCurrentUser";
import IProduct from "seller";

interface HandleRequest extends Request {
    params: {
        id: string
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId as string

        if (categoryId) {
            var products = await prisma.product.findMany({
                where: {
                    categoryId: parseInt(categoryId)
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    teamPrice: true,
                    price: true,
                    imageLink: true,
                    categoryId: true,
                    seller: {
                        select: {
                            id: true,
                            brandName: true
                        }
                    }
                }
            })
        }

        else {
            var products = await prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    teamPrice: true,
                    price: true,
                    imageLink: true,
                    categoryId: true,
                    seller: {
                        select: {
                            id: true,
                            brandName: true
                        }
                    }
                }
            })
        }

        res.json({ products: products })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to list products' })
    }
}

const show = async (req: HandleRequest, res: Response) => {
    try {
        const productId = parseInt(req.params.id)
        const product = await prisma.product.show(productId)
        res.json({ product: product })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to fetch product details' })
    }
}

const create = async (req: Request, res: Response) => {
    const createParams = productParams.safeParse(req.body)
    if (!createParams.success) {
        return res.status(422).json({ error: "Unable to create product" })
    }

    const seller = await sellerPrisma.default.seller.sellerInfo(req.userId);

    if (!seller) throw new Error('Invalid Seller')

    const productDetails: IProduct = createParams.data.product;

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

        res.status(200).json({ product: product })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable upload image, please try again' })
    }
}

const addReview = async (req: Request, res: Response) => {
    try {
        const productReviewRequest = productReviewParams.safeParse(req.body);
        if (!productReviewRequest.success) throw new Error('Unable to add review to the product');

        const review = await prisma.review.create({
            data: {
                userId: req.userId, ...productReviewRequest.data.review
            }
        });

        if (!review) throw new Error('Unable to add review to the product');

        res.status(200).json(review)
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable to add review to the product' });
    }
}

export {
    index,
    show,
    create,
    addReview,
    uploadProductImage as uploadImage
}