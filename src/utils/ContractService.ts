import { ethers } from 'ethers'
import { toEth } from '.'
import * as constants from '../data'
import multicall from './multicall'

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

export const getTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI), provider)

export const getXTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_XTOKEN_ABI), provider)

export const getVeTokenContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_VETOKEN_ABI), provider)

export const getVeTokenFeesContract = (provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        constants.CONTRACT_CREDITUM[250].token.vecreditfees,
        JSON.parse(constants.CONTRACT_VETOKENFEES_ABI),
        provider
    )

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
) => getContract(address, JSON.parse(constants.CONTRACT_REVENANT_ABI), provider)

export const getMerkleContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_MERKLE_ABI), provider)

//CREDITUM
export const getUnitrollerContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(constants.CONTRACT_CONTROLLER_ABI), provider)

export const getCreditumContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(constants.CONTRACT_CREDITUM_ABI), provider)

export const getFarmsContract = (provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        constants.CONTRACT_CREDITUM_FARMS[250].farmAddress,
        JSON.parse(constants.CONTRACT_FARMS_ABI),
        provider
    )

export const getCrvContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address, JSON.parse(constants.CONTRACT_CRV_ABI), provider)

//SINGULARITY

export const getSingOracleContract = (
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(constants.CONTRACT_SINGULARITY[250].oracle, JSON.parse(constants.CONTRACT_CRV_ABI), provider)

export const getSingRouterContract = (
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(constants.CONTRACT_SINGULARITY[250].router, JSON.parse(constants.CONTRACT_CRV_ABI), provider)

export const getSingFactoryContract = (
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(constants.CONTRACT_SINGULARITY[250].factory, JSON.parse(constants.CONTRACT_CRV_ABI), provider)

export const getSingLpContract = (
    address,
    provider?: ethers.Signer | ethers.providers.Provider
) => getContract(address, JSON.parse(constants.CONTRACT_CRV_ABI), provider)

//UTILS

export const fetchBalances = async (account: string, tokens: any, allowAddress: string) => {
    if (tokens) {
        const abi = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)
        const walletBalanceCalls = tokens.map((token) => ({
            address: token.address,
            name: 'balanceOf',
            params: [account]
        }))
        const allowanceCalls = tokens.map((token) => ({
            address: token.address,
            name: 'allowance',
            params: [account, allowAddress]
        }))
        const totalSupplyCalls = tokens.map((token) => ({
            address: token.address,
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
