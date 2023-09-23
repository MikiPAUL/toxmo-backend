import { PrismaClient, Gender } from '@prisma/client'

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findUser(username: string, phone_number: string) {
        return prisma.user.findUnique({
          where: {
            username: username,
            phone_number: phone_number,
          },
        })
      },

      async storeOTP(userId: number, otp: string) {
        const date = new Date();
        date.setDate(date.getDate() + 1)
        return prisma.user.update({
          where: { 
            id: userId
           },
           data: {
            otp: parseInt(otp),
            otp_expire_at: date
           }
        })
      },
      async validOTP(phone_number: string, otp: string){
        const user = await prisma.user.findUnique({
            where: {
                phone_number: phone_number,
                otp: parseInt(otp)
            },
            select: {
                otp_expire_at: true
            }
        })
        return ((!user || !user.otp_expire_at) ? false : (user.otp_expire_at > new Date()))
      },
      async add(username: string, phone_number: string){
        return await prisma.user.create({
            data: {
                username: username,
                phone_number: phone_number
            }
        })
      },
      async modify(params: {
        id: number,
        username?: string, 
        phone_number?: string, 
        avatar?: Buffer, 
        address?: string, 
        gender?: Gender}){
            const {id, ...attr } = params
            return await prisma.user.update({
                where: {
                    id: id
                },
                data: attr
            })
        }
    },
  },
})

export default prisma;