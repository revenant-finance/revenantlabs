import { createContext, useContext, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import * as constants from '../../data'
import { EMPTY_ADDRESS, toEth } from '../../utils'
import { fetchBalances } from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import useRefresh from '../useRefresh'
import { ethers } from 'ethers'
import { FarmDataWrapper } from './useFarmData'

const formatCreditumData = (_assetCollateralData, _totalMinted, _stabilizerDeposits, _userData, _collateralData, _stabilizerData, _priceUsd, _positionData, _liquidationPrice, _utilizationRatio, _balances, _fTokenData, _fTokenBalances, _contractBalance) => {
    return {
        ..._assetCollateralData,
        totalMinted: toEth(_totalMinted),
        stabilizerDeposits: toEth(_stabilizerDeposits, _assetCollateralData.decimals),
        userDebt: toEth(_userData?.debt),
        userDeposits: toEth(_userData?.deposits, _assetCollateralData.decimals),
        collateralAllowed: _collateralData?.allowed,
        collateralStabilityFee: toEth(_collateralData?.stabilityFee),
        collateralMaxDebtRatio: toEth(_collateralData?.maxDebtRatio),
        collateralMintLimit: toEth(_collateralData?.mintLimit),
        collateralLiquidationThreshold: toEth(_collateralData?.liquidationThreshold),
        collateralLiquidationPenalty: toEth(_collateralData?.liquidationPenalty),
        collateralMintFee: toEth(_collateralData?.mintFee),
        stabilizerAllowed: _stabilizerData?.allowed,
        stabilizerFee: toEth(_stabilizerData?.stabilizerFee),
        priceUsd: toEth(_priceUsd),
        positionCollateralValue: toEth(_positionData[1]),
        positionDebtValue: toEth(_positionData[2]),
        positionLiquidity: toEth(_positionData[3]),
        positionShortFall: toEth(_positionData[4]),
        positionHealthFactor: toEth(_positionData[5]),
        liquidationPrice: toEth(_liquidationPrice),
        utilizationRatio: toEth(_utilizationRatio),
        ..._balances,
        fToken: { ..._fTokenBalances, ..._fTokenData },
        contractBalance: toEth(_contractBalance, _assetCollateralData.decimals)
    }
}

function useCreditumDataInternal() {
    const { slowRefresh } = useRefresh()
    const [refreshing, setRefreshing] = useState(false)
    const [creditumData, setCreditumData] = useState({})
    const { account } = useWallet()

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const creditumABI = JSON.parse(constants.CONTRACT_CREDITUM_ABI)
    const controllerABI = JSON.parse(constants.CONTRACT_CONTROLLER_ABI)
    const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true)
            const assetIds = Object.keys(constants.CONTRACT_CREDITUM[250].ftoken)

            let formattedCreditumData = new Object()
            for (let i = 0; i < assetIds.length; i++) {
                const assetData = constants.CONTRACT_CREDITUM[250].ftoken[assetIds[i]]
                const assetCollaterals = Object.values(assetData.collaterals)
                //creditum
                const totalMintedCalls = assetCollaterals.map((collateral) => ({
                    address: assetData.mint.creditum,
                    name: 'totalMinted',
                    params: [collateral.address]
                }))
                const stabilizerDepositsCalls = assetCollaterals.map((collateral) => ({
                    address: assetData.mint.creditum,
                    name: 'stabilizerDeposits',
                    params: [collateral.address]
                }))

                const collateralDataCalls = assetCollaterals.map((collateral) => ({
                    address: assetData.mint.unitroller,
                    name: 'collateralData',
                    params: [collateral.address]
                }))
                const stabilizerDataCalls = assetCollaterals.map((collateral) => ({
                    address: assetData.mint.unitroller,
                    name: 'stabilizerData',
                    params: [collateral.address]
                }))

                const priceUsdCalls = assetCollaterals.map((collateral) => ({
                    address: assetData.mint.unitroller,
                    name: 'getPriceUSD',
                    params: [collateral.address]
                }))
                const contractBalanceCalls = assetCollaterals.map((collateral) => ({
                    address: collateral.address,
                    name: 'balanceOf',
                    params: [assetData.mint.creditum]
                }))

                let userDataCalls, positionDataCalls, liquidationPriceCalls, utilizationRatioCalls, collateralBalances, fTokenBalances
                if (account) {
                    //creditum
                    userDataCalls = assetCollaterals.map((collateral) => ({
                        address: assetData.mint.creditum,
                        name: 'userData',
                        params: [collateral.address, account]
                    }))

                    //unitroller
                    positionDataCalls = assetCollaterals.map((collateral) => ({
                        address: assetData.mint.unitroller,
                        name: 'getPositionData',
                        params: [account, collateral.address]
                    }))

                    liquidationPriceCalls = assetCollaterals.map((collateral) => ({
                        address: assetData.mint.unitroller,
                        name: 'getLiquidationPrice',
                        params: [account, collateral.address]
                    }))
                    utilizationRatioCalls = assetCollaterals.map((collateral) => ({
                        address: assetData.mint.unitroller,
                        name: 'getUtilizationRatio',
                        params: [account, collateral.address]
                    }))

                    collateralBalances = await fetchBalances(account, assetCollaterals, assetData.mint.creditum)
                    fTokenBalances = await fetchBalances(account, [assetData.mint], assetData.mint.creditum)
                } else {
                    fTokenBalances = await fetchBalances(EMPTY_ADDRESS, [assetData.mint], assetData.mint.creditum)
                }

                const [totalMinted, stabilizerDeposits, userData, collateralData, stabilizerData, priceUsd, positionData, liquidationPrice, utilizationRatio, contractBalance] = await Promise.all([
                    multicall(creditumABI, totalMintedCalls),
                    multicall(creditumABI, stabilizerDepositsCalls),
                    multicall(creditumABI, userDataCalls),
                    multicall(controllerABI, collateralDataCalls),
                    multicall(controllerABI, stabilizerDataCalls),
                    multicall(controllerABI, priceUsdCalls),
                    multicall(controllerABI, positionDataCalls),
                    multicall(controllerABI, liquidationPriceCalls),
                    multicall(controllerABI, utilizationRatioCalls),
                    multicall(erc20ABI, contractBalanceCalls)
                ])

                const formattedAssetData = []
                for (let i = 0; i < collateralData.length; i++) {
                    formattedAssetData.push(
                        formatCreditumData(
                            assetCollaterals[i],
                            totalMinted[i][0],
                            stabilizerDeposits[i][0],
                            userData ? userData[i] : {},
                            collateralData[i],
                            stabilizerData[i],
                            priceUsd[i][1],
                            positionData ? positionData[i] : {},
                            liquidationPrice ? liquidationPrice[i][1] : null,
                            utilizationRatio ? utilizationRatio[i][1] : null,
                            collateralBalances ? collateralBalances[i] : {},
                            assetData.mint,
                            fTokenBalances ? fTokenBalances[0] : {},
                            contractBalance ? contractBalance[i][0] : null
                        )
                    )
                }
                formattedCreditumData[assetIds[i]] = formattedAssetData
            }

            console.log('refreshing collaterals result ===== ')
            setCreditumData(formattedCreditumData)
            setRefreshing(false)
        }
        fetchData()
    }, [account, slowRefresh, refresh])

    return {
        creditumData,
        update,
        refreshing
    }
}

export const CreditumContext = createContext({})

export function CreditumDataWrapper({ children }: any) {
    const creditumData = useCreditumDataInternal()

    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const [showDepositTool, setShowDepositTool] = useState(false)
    const [showRepayTool, setShowRepayTool] = useState(false)

    const [selectedMarket, setSelectedMarket] = useState(null)

    const [depositInput, setDepositInput] = useState(0)
    const [borrowInput, setBorrowInput] = useState(0)
    const [repayInput, setRepayInput] = useState(0)
    const [withdrawInput, setWithdrawInput] = useState(0)

    return (
        <>
            <FarmDataWrapper>
                <CreditumContext.Provider value={{ ...creditumData, selectedMarket, setSelectedMarket, depositInput, setDepositInput, borrowInput, setBorrowInput, repayInput, setRepayInput, withdrawInput, setWithdrawInput, showMoreInfo, setShowMoreInfo, showDepositTool, setShowDepositTool, showRepayTool, setShowRepayTool }}>
                    <>{children}</>
                </CreditumContext.Provider>
            </FarmDataWrapper>
        </>
    )
}

export default function useCreditumData() {
    return useContext(CreditumContext) as any
}
