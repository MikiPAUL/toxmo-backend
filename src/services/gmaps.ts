import { Client, DistanceMatrixRequest, UnitSystem } from "@googlemaps/google-maps-services-js"
import type { Address } from '@prisma/client'

const client = new Client({})

const constructAddress = (address: Address) => {
    const { address1, address2, city, state, country, pincode } = address

    return (`${address1}, ${city}, ${state}, ${country}, ${pincode}`)
}

const checkWithinDeliveryDistance = async (deliveryRadius: number, destination: Address, origin: Address) => {

    const sellerAddress = constructAddress(origin), userAddress = constructAddress(destination)

    console.log(sellerAddress, userAddress)

    const locationInfo: DistanceMatrixRequest = {
        params: {
            destinations: [userAddress],
            origins: [sellerAddress],
            units: UnitSystem.metric,
            key: process.env['GOOGLE_MAPS_API_KEY'] || 'api_key'
        }
    }
    const distanceInfo = await client.distancematrix(locationInfo)

    console.log(distanceInfo.request)
    if (distanceInfo.status != 200) {
        throw new Error('Unable to fetch distance information')
    }
    const distanceBtwSellerUser = distanceInfo.data.rows.at(0)?.elements.at(0)?.distance.text
    if (!distanceBtwSellerUser) throw new Error('Distance Information not available')

    const distText = distanceBtwSellerUser.split(' ').at(0)
    if (!distText) throw new Error('Distance Text not available')

    return parseFloat(distText) <= deliveryRadius
}

export { checkWithinDeliveryDistance }
