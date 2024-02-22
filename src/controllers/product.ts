import { Request, Response } from "express"
import prisma from "../models/product";
import relationshipPrisma from "../models/relationship";
import * as sellerPrisma from "../models/seller";
import { productParams, productReviewParams, productUpdateParams } from "../lib/validations/product"

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
        res.json({ products: products })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to list products' })
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id)
        const product: { [k: string]: any } | null = await prisma.product.show(productId)

        if (!product) return res.status(404).json({ error: 'Product not found ' })

        const isFollowing = await relationshipPrisma.relationship.alreadyFollowing(req.userId, product.sellerId)
        product.seller['isFollowing'] = isFollowing
        res.json({ product: { ...product } })
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
                        description: true, rating: true,
                        user: {
                            select: {
                                id: true, username: true
                            }
                        }
                    }
                }
            }
        })
        res.status(422).json({ reviews: productReviews?.reviews })
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
    addReview,
    reviews
}