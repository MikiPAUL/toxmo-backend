import { Twilio } from 'twilio';
const client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);


const sendOtp = async (phoneNumber: string): Promise<string | null> => {
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