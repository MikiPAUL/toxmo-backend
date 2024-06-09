import { Twilio } from 'twilio';
const client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);


const staticOtp = new Map()
staticOtp.set('9566012163', '1111')
staticOtp.set('8220210192', '2222')
staticOtp.set('9750492304', '3333')

const sendOtp = async (phoneNumber: string): Promise<string | null> => {
    if (staticOtp.has(phoneNumber)) return staticOtp.get(phoneNumber)
    const otp = generateOtp();
    const response = await client.messages
        .create({
            body: 'Your toxmo otp for login is ' + otp,
            from: '+16026414167',
            to: '+91' + phoneNumber
        });
    return response.errorCode == null ? otp : null
}

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

export default sendOtp