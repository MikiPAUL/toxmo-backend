import { Request, Response } from "express"
import prisma from "../models/product";
import relationshipPrisma from "../models/relationship";
import * as sellerPrisma from "../models/seller";
import { productParams, productUpdateParams } from "../lib/validations/product"
import { IProductDetails } from "product";

const index = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId as string

        if (categoryId) {
            var sellerProducts = await prisma.seller.findMany({
                where: {
                    categoryId: parseInt(categoryId)
                },
                select: {
                    products: {
                        where: {
                            stockQuantity: {
                                gt: 0
                            }
                        },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            teamPrice: true,
                            price: true,
                            imageLink: true,
                            seller: {
                                select: {
                                    id: true,
                                    brandName: true
                                }
                            }
                        }
                    }
                }
            })
            var products = sellerProducts.flatMap(sellerProduct => sellerProduct.products)
        }

        else {
            var products = await prisma.product.findMany({
                where: {
                    stockQuantity: {
                        gt: 0
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    teamPrice: true,
                    price: true,
                    imageLink: true,
                    seller: {
                        select: {
                            id: true,
                            brandName: true
                        }
                    }
                }
            })
        }
        res.json({
            products: products.map(product => {
                return { ...product, imageLink: `${process.env['CDN_URL']}/${product.imageLink}` }
            })
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to list products' })
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id)
        const product: IProductDetails | null = await prisma.product.show(productId)

        if (!product) return res.status(404).json({ error: 'Product not found ' })

        const isFollowing = await relationshipPrisma.relationship.alreadyFollowing(req.userId, product.sellerId)
        res.json({ product: { ...product, seller: { ...product.seller, isFollowing }, imageLink: `${process.env['CDN_URL']}/${product.imageLink}` } })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to fetch product details' })
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const createParams = productParams.safeParse(req.body)
        if (!createParams.success) {
            return res.status(422).json({ error: "Unable to create product" })
        }

        const seller = await sellerPrisma.default.seller.sellerInfo(req.userId);

        if (!seller) throw new Error('Invalid Seller')

        const productDetails = createParams.data.product;

        const product = await prisma.product.add({ ...productDetails, sellerId: seller.id })
        if (!product) {
            return res.status(422).json({ error: "Unable to create product" })
        }
        res.json({ product: product })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable upload product, please try again' })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const productRequest = productUpdateParams.safeParse(req.body)
        const productId = req.params.id
        if (!productRequest.success) return res.status(422).json({ error: 'Invalid request body' })

        const productDetails = productRequest.data.product
        const product = await prisma.product.update({
            where: {
                id: parseInt(productId)
            },
            data: {
                ...productDetails
            }
        })
        res.status(200).json({ product })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message });
        else res.status(422).json({ error: 'Unable to update product details' });
    }
}

const reviews = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id as string

        const productReviews = await prisma.product.findUnique({
            where: {
                id: parseInt(productId)
            },
            select: {
                reviews: {
                    select: {
                        description: true, rating: true, createdAt: true,
                        user: {
                            select: {
                                id: true, username: true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json({ reviews: productReviews?.reviews })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to get product reviews' })
    }
}

export {
    index,
    show,
    update,
    create,
    reviews
}