import dayjs from 'dayjs'
import { BigNumber, ethers, utils, constants } from 'ethers'
import { getAddress } from 'ethers/lib/utils'

const commaNumber = require('comma-number')

const format = commaNumber.bindWith(',', '.')

export const currentEpoch = parseInt(+new Date()) / 1000

export const ZERO_ADDRESS = constants.AddressZero
export const EMPTY_ADDRESS = '0x0Af3F4817dcD3644ca7e0319dDe861932544D0D5'
export const MAX_UINT256 = constants.MaxUint256
export const SECONDS_PER_YEAR = 31536000

export const epochToDate = (epoch) => {
    return dayjs.unix(epoch).format('MMM D, YYYY')
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

export function getFtmScanLink(data: string, type: 'transaction' | 'token' | 'address'): string {
    const prefix = 'https://ftmscan.com'

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'token': {
            return `${prefix}/token/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function toWei(ether: string, decimals = 18): BigNumber {
    return utils.parseUnits(ether, decimals)
}

export function toEth(ether: ethers.BigNumberish | string, decimals = 18): string {
    if (ether) {
        const tempAmount = utils.formatUnits(ether, decimals)
        if (tempAmount.substr(tempAmount.indexOf('.') + 1) === '0') {
            return tempAmount.slice(0, tempAmount.indexOf('.'))
        }
        return tempAmount
    }
    return null
}

export const getBigNumber = (value) => {
    if (!value) {
        return BigNumber.from(0)
    }
    if (BigNumber.isBigNumber(value)) {
        return value
    }
    return BigNumber.from(value)
}

export const currencyFormatter = (labelValue) => {
    let suffix = ''
    let unit = 1
    const abs = Math.abs(Number(labelValue))
    if (abs >= 1.0e9) {
        // Nine Zeroes for Billions
        suffix = 'B'
        unit = 1.0e9
    } else if (abs >= 1.0e6) {
        // Six Zeroes for Millions
        suffix = 'M'
        unit = 1.0e6
    } else if (abs >= 1.0e3) {
        // Three Zeroes for Thousands
        suffix = 'K'
        unit = 1.0e3
    }
    return `${format(Math.floor((abs / unit) * 100) / 100)}${suffix}`
    // return Math.abs(Number(labelValue)) >= 1.0e9
    //   ? `$${format(
    //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e9}`).dp(2, 1)
    //     )}B`
    //   : Math.abs(Number(labelValue)) >= 1.0e6
    //   ? `$${format(
    //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e6}`).dp(2, 1)
    //     )}M`
    //   : Math.abs(Number(labelValue)) >= 1.0e3
    //   ? `$${format(
    //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e3}`).dp(2, 1)
    //     )}K`
    //   : `$${format(new BigNumber(`${Math.abs(Number(labelValue))}`).dp(2, 1))}`;
}

export const formatter = (value, decimals = 2, suffixStr = '') => {
    if (!value) return 0
    let suffix = ''
    let unit = 1
    if (isNaN(parseFloat(value))) {
        return null
    }
    const abs = Number(value) || 0

    if (abs >= 1.0e9) {
        // Nine Zeroes for Billions
        suffix = 'B'
        unit = 1.0e9
    } else if (abs >= 1.0e6) {
        // Six Zeroes for Millions
        suffix = 'M'
        unit = 1.0e6
    } else if (abs >= 1.0e3) {
        // Three Zeroes for Thousands
        suffix = 'K'
        unit = 1.0e3
    }

    return `${format(
        Math.floor((abs / unit) * Math.pow(10, decimals)) / Math.pow(10, decimals)
    )}${suffix}${suffixStr && ` ${suffixStr}`}`
}

export const commaFormatter = (value, decimals = 2) => {
    if (!value) return Number(0).toFixed(decimals)
    return commaNumber(Number(value).toFixed(decimals))
}

export const sumOfArray = (array) => {
    return array.reduce((pv, cv) => pv + cv, 0)
}
