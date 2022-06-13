import { ethers } from 'ethers'
import { toEth } from '.'
import * as constants from '../data'
import multicall from './multicall'
import * as revConstants from '../Revenant/data'
import * as singConstants from '../Singularity/data'

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_NETWORK_URL
)

//GENERAL

export const getContract = (
    address: string,
    abi: any,
    signer?: ethers.Signer | ethers.providers.Provider
) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}

export const getTestTokenContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(singConstants.CONTRACT_TEST_ERC20_ABI), provider)

export const getTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI), provider)

export const getXTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_XTOKEN_ABI), provider)

export const getVeTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_VETOKEN_ABI), provider)


export const getMulticallContract = (provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        constants.UTIL_CONTRACT_ADDRESS[250].multicall,
        JSON.parse(constants.CONTRACT_MULTICALL_ABI),
        provider
    )

export const getRouterContract = (provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        constants.UTIL_CONTRACT_ADDRESS[250].spookyRouter,
        JSON.parse(constants.CONTRACT_SPOOKY_ROUTER_ABI),
        provider
    )

//REVNENANT
export const getRevenantContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(revConstants.CONTRACT_REVENANT_ABI), provider)

export const getMerkleContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(revConstants.CONTRACT_MERKLE_ABI), provider)

//SINGULARITY

export const getSingOracleContract = (provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        singConstants.CONTRACT_SINGULARITY[250].oracle,
        JSON.parse(singConstants.CONTRACT_SING_ORACLE_ABI),
        provider
    )

export const getSingRouterContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(singConstants.CONTRACT_SING_ROUTER_ABI), provider)

export const getSingFactoryContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(singConstants.CONTRACT_SING_FACTORY_ABI), provider)

export const getSingLpContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(singConstants.CONTRACT_SING_LP_ABI), provider)

//UTILS

export const fetchBalances = async (
    account: string,
    tokens: any,
    allowAddress: string,
    addressField: string
) => {
    if (tokens) {
        const abi = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)
        const walletBalanceCalls = tokens.map((token) => ({
            address: token[`${addressField}`],
            name: 'balanceOf',
            params: [account]
        }))
        const allowanceCalls = tokens.map((token) => ({
            address: token[`${addressField}`],
            name: 'allowance',
            params: [account, allowAddress]
        }))
        const totalSupplyCalls = tokens.map((token) => ({
            address: token[`${addressField}`],
            name: 'totalSupply'
        }))

        const [wallet, allow, totalSupply] = await Promise.all([
            multicall(abi, walletBalanceCalls),
            multicall(abi, allowanceCalls),
            multicall(abi, totalSupplyCalls)
        ])
        return tokens.map((token, index) => ({
            walletBalance: toEth(wallet[index][0], token.decimals),
            allowBalance: toEth(allow[index][0], token.decimals),
            totalSupply: toEth(totalSupply[index][0], token.decimals)
        }))
    }
    return null
}
