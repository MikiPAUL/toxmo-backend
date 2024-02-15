interface IProduct {
    name: string,
    price: number,
    description: string,
    teamPrice: number,
    teamSize: number,
    stockQuantity: number,
    sellerId?: number
}

export default IProduct;