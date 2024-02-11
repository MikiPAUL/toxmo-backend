import { PrismaClient, PurchaseType } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    model: {
        liveStream: {

        }
    }
})

export default prisma