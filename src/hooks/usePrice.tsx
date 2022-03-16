import axios from 'axios'
import { useActiveWeb3React } from '.'
import { getRouterContract } from '../utils/ContractService'

export default function usePrice() {
    const { library } = useActiveWeb3React()
    const routerContract = getRouterContract(library)
    const wftmAddress = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
    const usdcAddress = '0x04068da6c83afcfa0e13ba15a6696662335d5b75'

    const getPrice = async (address) => {
        const AGEURO_ADDRESS = '0x02a2b736f9150d36c0919f3acee8ba2a92fbbb40'
        const ANGLE_ADDRESS = '0x3b9e3b5c616A1A038fDc190758Bbe9BAB6C7A857'
        const price =
            address === ANGLE_ADDRESS
                ? await getPriceAngle()
                : address === AGEURO_ADDRESS
                ? await getPriceAgEUR()
                : await getPriceSpooky(address)
        return price
    }

    const getPriceSpooky = async (tokenAddress) => {
        const path = [wftmAddress, usdcAddress]
        if (tokenAddress !== wftmAddress) {
            path.unshift(tokenAddress)
        }
        const prices = await routerContract.getAmountsOut('1000000000000000000', path)
        const priceData = Number(prices[prices.length - 1]) / 1000000
        return priceData
    }

    const getPriceAngle = async () => {
        const { data } = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=angle-protocol&vs_currencies=usd'
        )
        if (!data) return '0'
        return data['angle-protocol'].usd
    }

    const getPriceAgEUR = async () => {
        const { data } = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=ageur&vs_currencies=usd'
        )
        if (!data) return '0'
        return data['ageur'].usd
    }

    return {
        getPrice
    }
}
