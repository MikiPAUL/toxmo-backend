import { PrismaClient, Gender } from '@prisma/client'
import moment from 'moment'

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
        const date = moment().utcOffset("+05:30").add(1, 'minute').format()
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
              gt: moment().utcOffset("+05:30").format()
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
        address?: string,
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