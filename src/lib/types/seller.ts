interface IProduct {
    name: string,
    price: number,
    categoryId: number,
    teamPrice: number,
    teamSize: number,
    stockQuantity: number,
    sellerId?: number,
    otherDetails: Record<string, any>
}

export default IProduct;