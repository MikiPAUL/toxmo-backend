import { Request, Response } from "express"
import prisma from "../models/product";
import relationshipPrisma from "../models/relationship";
import sellerPrisma from "../models/seller";
import userPrisma from "../models/user";
import { productParams, productUpdateParams } from "../lib/validations/product"
import { IProductDetails } from "product";
import { checkWithinDeliveryDistance } from "../services/gmaps";

const index = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId as string

        if (categoryId) {
            var sellerProducts = await prisma.seller.findMany({
                where: {
                    categoryId: parseInt(categoryId),
                    shopOpen: true
                },
                select: {
                    products: {
                        where: {
                            stockQuantity: {
                                gt: 0
                            },
                            Video: {
                                some: {}
                            }
                        },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            imageLink: true,
                            seller: {
                                select: {
                                    id: true,
                                    brandName: true
                                }
                            },
                            Video: {
                                select: {
                                    videoMetaData: {
                                        select: {
                                            url: true
                                        }
                                    }
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
                    },
                    seller: {
                        shopOpen: true
                    },
                    Video: {
                        some: {}
                    }
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    imageLink: true,
                    seller: {
                        select: {
                            id: true,
                            brandName: true
                        }
                    },
                    Video: {
                        select: {
                            videoMetaData: {
                                select: {
                                    url: true
                                }
                            }
                        }
                    }
                }
            })
        }

        const userAddress = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            include: {
                address: true
            }
        })
        if (userAddress && userAddress.address) {
            const { address } = userAddress
            products = products.filter(async (product) => {
                const sellerDeliveryDetail = await prisma.seller.findUnique({
                    where: {
                        id: product.seller.id
                    },
                    include: {
                        address: true
                    },
                    select: {
                        DeliveryOption: {
                            select: {
                                deliveryRadius: true
                            },
                            orderBy: {
                                deliveryRadius: 'desc'
                            },
                            take: 1
                        }
                    }
                })
                const radius = sellerDeliveryDetail?.DeliveryOption.at(0)?.deliveryRadius
                if (!radius || !sellerDeliveryDetail.address) return false
                return checkWithinDeliveryDistance(radius, address, sellerDeliveryDetail.address)
            })
        }
        res.json({
            products: products.map(product => {
                return { ...product }
            }).sort(() => (0.5 - Math.random()))
        })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'unable to list products' })
    }
}

// const show = async (req: Request, res: Response) => {
//     try {
//         const productId = parseInt(req.params.id)
//         const product: IProductDetails | null = await prisma.product.show(productId)

//         if (!product) return res.status(404).json({ error: 'Product not found ' })

//         const userAddress = (await userPrisma.user.getAddress(req.userId))?.address,
//             sellerAddress = (await sellerPrisma.seller.getAddress(product.sellerId))?.address

//         let withinDeliverDist: boolean | null = null
//         if (userAddress && sellerAddress && product.seller.deliveryRadius) {
//             withinDeliverDist = await checkWithinDeliveryDistance(product.seller.deliveryRadius, userAddress, sellerAddress)
//         }

//         const isFollowing = await relationshipPrisma.relationship.alreadyFollowing(req.userId, product.sellerId)
//         res.json({ product: { ...product, seller: { ...product.seller, isFollowing }, withinDeliverDist } })
//     }
//     catch (e) {
//         if (e instanceof Error) res.status(422).json({ error: e.message })
//         else res.status(422).json({ error: 'unable to fetch product details' })
//     }
// }

const create = async (req: Request, res: Response) => {
    try {
        const createParams = productParams.safeParse(req.body)
        if (!createParams.success) {
            return res.status(422).json({ error: "Unable to create product" })
        }

        const seller = await sellerPrisma.seller.sellerInfo(req.userId);

        if (!seller || !seller.active || !seller.shopOpen) throw new Error('Invalid Seller')

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

// const reviews = async (req: Request, res: Response) => {
//     try {
//         const productId = req.params.id as string

//         const productReviews = await prisma.product.findUnique({
//             where: {
//                 id: parseInt(productId)
//             },
//             select: {
//                 reviews: {
//                     select: {
//                         description: true, rating: true, createdAt: true,
//                         user: {
//                             select: {
//                                 id: true, username: true
//                             }
//                         }
//                     }
//                 }
//             }
//         })
//         res.status(200).json({ reviews: productReviews?.reviews })
//     }
//     catch (e) {
//         if (e instanceof Error) res.status(422).json({ error: e.message })
//         else res.status(422).json({ error: 'Unable to get product reviews' })
//     }
// }

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await prisma.product.delete({
            where: {
                id: parseInt(id),
                sellerId: req.userId
            }
        })
        res.sendStatus(204)
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: 'Unable to delete the product' })
    }
}

export {
    index,
    // show,
    update,
    create,
    destroy
    // reviews
}