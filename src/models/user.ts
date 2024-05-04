import { PrismaClient, Gender } from '@prisma/client'

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findUser(username: string, phoneNumber: string, id: number) {
        return await prisma.user.findUnique({
          where: {
            id: id,
            username: username,
            phoneNumber: phoneNumber,
          },
        })
      },

      async checkUserName(username: string, phoneNumber: string) {
        return prisma.user.findUnique({
          where: {
            username
          }
        })
      },

      async checkPhoneNumber(phoneNumber: string) {
        return prisma.user.findUnique({
          where: {
            phoneNumber
          }
        })
      },

      async storeOTP(userId: number, otp: string) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 1)
        return prisma.user.update({
          where: {
            id: userId
          },
          data: {
            otp: parseInt(otp),
            otpExpireAt: date
          }
        })
      },
      async validOTP(phoneNumber: string, otp: string) {
        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: phoneNumber,
            otp: parseInt(otp),
            otpExpireAt: {
              gt: new Date()
            }
          }
        })
        return user;
      },
      async add(username: string, phoneNumber: string) {
        return await prisma.user.create({
          data: {
            username: username,
            phoneNumber: phoneNumber
          }
        })
      },
      async modify(params: {
        id: number,
        username?: string,
        phoneNumber?: string,
        avatar?: Buffer,
        gender?: Gender
      }) {
        const { id, ...attr } = params
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