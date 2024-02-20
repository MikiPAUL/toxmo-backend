import { Request, Response } from 'express'
import { adminLoginParams } from '../../lib/validations/authentication'

const signIn = async (req: Request, res: Response) => {
    try {
        const adminLoginReq = adminLoginParams.safeParse(req.body)

        if (!adminLoginReq.success) return res.status(422).json({ error: 'Invalid request body' })

        const { username, password } = adminLoginReq.data.auth

        if (username === 'admin' && password === 'girish') {
            res.setHeader('admin', 'girish')
            res.status(200).json({ success: true, message: 'Successfully logged in' })
        }
        else res.status(401).json({ error: 'Unauthorized' })
    }
    catch (e) {
        if (e instanceof Error) res.status(422).json({ error: e.message })
        else res.status(422).json({ error: "Something went wrong" })
    }
}

export {
    signIn
}