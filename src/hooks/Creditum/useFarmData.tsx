import { BigNumber } from 'ethers'
import { createContext, useContext, useEffect, useState } from 'react'
import * as constants from '../../data'
import { EMPTY_ADDRESS, toEth } from '../../utils'
import { getFarmsContract } from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import useRefresh from '../useRefresh'
import usePool from './usePool'
import { useActiveWeb3React } from '..'

const farmABI = JSON.parse(constants.CONTRACT_FARMS_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)
const farms = constants.CONTRACT_CREDITUM_FARMS[250].tokens

const formatFarmData = (_farmInfo, _userInfo, _depositTokenBalance, _allowance) => {
    return {
        ..._farmInfo,
        deposited: toEth(_userInfo[0].amount, _farmInfo.decimals),
        depositTokenBalance: toEth(_depositTokenBalance[0], _farmInfo.decimals),
        allowance: toEth(_allowance[0], _farmInfo.decimals)
    }
}

function useFarmDataInternal() {
    const { slowRefresh } = useRefresh()
    const [refreshing, setRefreshing] = useState(false)
    const [farmData, setFarmData] = useState()
    const { account } = useActiveWeb3React()
    const { calculateUni, calculateCrv } = usePool()
    const farmsContract = getFarmsContract()

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const handleTokenCalls = async (_farms) => {
        const farmStatCalls = _farms.map((farm) => {
            if (farm.uniLpTokenAddresses) {
                return calculateUni(farm)
            } else if (farm.crvLpTokenAddresses) {
                return calculateCrv(farm)
            }
        })

        let earnings = []
        for (let i = 0; i < _farms.length; i++) {
            let poolRewards = ['0', '0', '0', '0', '0']
            if (_farms[i].deposited !== '0') {
                const rewardsData = await farmsContract.pendingRewards(_farms[i].pid, account)
                poolRewards = rewardsData.map((reward) => toEth(reward))
            }
            earnings.push(poolRewards)
        }
        const farmStats = await Promise.all(farmStatCalls)
        let tvl = 0
        const formattedFarmData = _farms.map((farm, i) => {
            const _farmStats = farmStats[i]
            tvl += _farmStats.tvl
            return { ..._farmStats, ...farm, earnings: earnings[i] }
        })
        return {farms: formattedFarmData, tvl}
    }

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true)

            const userAddress = account ? account : EMPTY_ADDRESS

            const userInfoCalls = farms.map((farm) => ({
                address: constants.CONTRACT_CREDITUM_FARMS[250].farmAddress,
                name: 'getUserInfo',
                params: [farm.pid, userAddress]
            }))
            const depositTokenBalanceCalls = farms.map((farm) => ({
                address: farm.depositToken,
                name: 'balanceOf',
                params: [userAddress]
            }))
            const allowanceCalls = farms.map((farm) => ({
                address: farm.depositToken,
                name: 'allowance',
                params: [userAddress, constants.CONTRACT_CREDITUM_FARMS[250].farmAddress]
            }))

            const [userInfo, depositTokenBalance, allowance] = await Promise.all([multicall(farmABI, userInfoCalls), multicall(erc20ABI, depositTokenBalanceCalls), multicall(erc20ABI, allowanceCalls)])

            let formattedFarmData = []
            for (let i = 0; i < farms.length; i++) {
                const farm = formatFarmData(farms[i], userInfo[i] ? userInfo[i] : null, depositTokenBalance[i] ? depositTokenBalance[i] : BigNumber.from(0), allowance[i] ? allowance[i] : BigNumber.from(0))
                formattedFarmData.push(farm)
            }

            formattedFarmData = await handleTokenCalls(formattedFarmData)

            console.log('refreshing farm result ===== ')
            setFarmData(formattedFarmData)
            setRefreshing(false)
        }
        fetchData()
    }, [account, slowRefresh, refresh])
    return {
        farmData,
        update,
        refreshing
    }
}

export const FarmContext = createContext({})

export function FarmDataWrapper({ children }: any) {
    const farmData = useFarmDataInternal()
    return (
        <>
            <FarmContext.Provider value={{ ...farmData }}>
                <>{children}</>
            </FarmContext.Provider>
        </>
    )
}

export default function useFarmData() {
    return useContext(FarmContext) as any
}
