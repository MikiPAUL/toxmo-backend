import { Twilio } from 'twilio';
const client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);


const sendOtp = (phone_number: string) => {
    const otp = generateOtp()
    client.messages
    .create({
        body: 'Your toxmo otp for login is ' + otp,
        from: '+19894991224',
        to: '+91'+phone_number
    })
    .then();
    return otp
}
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
}

export default sendOtp