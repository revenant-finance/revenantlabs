import { createContext, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import * as constants from '../../data'
import * as credConstants from '../data'
import { EMPTY_ADDRESS, toEth, currentEpoch, SECONDS_PER_YEAR, multiplier } from '../../utils'
import { fetchBalances, getTokenContract } from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import usePrice from '../../hooks/usePrice'
import useRefresh from '../../hooks/useRefresh'
import { FarmDataWrapper } from './useFarmData'
import { VeCreditDataWrapper } from './useVeCreditData'

const creditumABI = JSON.parse(credConstants.CONTRACT_CREDITUM_ABI)
const controllerABI = JSON.parse(credConstants.CONTRACT_CONTROLLER_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

const formatCreditumData = (
    _assetCollateralData,
    _totalMinted,
    _stabilizerDeposits,
    _userData,
    _collateralData,
    _stabilizerData,
    _priceUsd,
    _positionData,
    _liquidationPrice,
    _utilizationRatio,
    _balances,
    _contractBalance
) => {
    let positionDebt = _userData?.debt
    if (Number(_userData.lastUpdatedAt) !== 0) {
        const timeElapsed = currentEpoch - Number(_userData.lastUpdatedAt)
        const fee = _userData?.debt?.mul(_collateralData?.stabilityFee).mul(timeElapsed).div(SECONDS_PER_YEAR).div(multiplier())
        positionDebt = _userData?.debt?.add(fee)
    }
    return {
        ..._assetCollateralData,
        totalMinted: toEth(_totalMinted),
        stabilizerDeposits: toEth(_stabilizerDeposits, _assetCollateralData.decimals),
        userDebt: toEth(positionDebt),
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
        contractBalance: toEth(_contractBalance, _assetCollateralData.decimals)
    }
}

async function getGovTokenData(tokenPrice) {
    const MAX_SUPPLY = 50000000
    const creditumContract = getTokenContract('0x77128DFdD0ac859B33F44050c6fa272F34872B5E')
    const [vesting, vestingSeb, multisig, farming, revenant] = await Promise.all([
        creditumContract.balanceOf('0x96AF48D95bf6e226D9696d6E074f40002407fEcC'),
        creditumContract.balanceOf('0x270144231ef669010780F2e72Fb414d056BaBa40'),
        creditumContract.balanceOf('0x667D9921836BB8e7629B3E0a3a0C6776dB538029'),
        creditumContract.balanceOf('0xe0c43105235C1f18EA15fdb60Bb6d54814299938'),
        creditumContract.balanceOf('0x3A276b8bfb9DEC7e19E43157FC9142B95238Ab6f')
    ])
    const circSupply =
        MAX_SUPPLY -
        Number(toEth(vesting)) -
        Number(toEth(vestingSeb)) -
        Number(toEth(multisig)) -
        Number(toEth(farming)) -
        Number(toEth(revenant))
    const marketCap = circSupply * tokenPrice
    return { circSupply, marketCap }
}

function useCreditumDataInternal() {
    const { slowRefresh } = useRefresh()
    const [refreshing, setRefreshing] = useState(false)
    const [creditumData, setCreditumData] = useState({})
    const [govTokenData, setGovTokenData] = useState({})
    const { account } = useActiveWeb3React()
    const { getPrice } = usePrice()

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true)
            const assetIds = Object.keys(credConstants.CONTRACT_CREDITUM[250].cToken)

            let formattedCreditumData = new Object()
            for (let i = 0; i < assetIds.length; i++) {
                const assetData = credConstants.CONTRACT_CREDITUM[250].cToken[assetIds[i]]
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

                let userDataCalls,
                    positionDataCalls,
                    liquidationPriceCalls,
                    utilizationRatioCalls,
                    collateralBalances,
                    cTokenBalances
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

                    const [collateralBalanceData, cTokenBalanceData] = await Promise.all([
                        fetchBalances(account, assetCollaterals, assetData.mint.creditum, 'address'),
                        fetchBalances(account, [assetData.mint], assetData.mint.creditum, 'address')
                    ])

                    collateralBalances = collateralBalanceData
                    cTokenBalances = cTokenBalanceData
                } else {
                    cTokenBalances = await fetchBalances(
                        EMPTY_ADDRESS,
                        [assetData.mint],
                        assetData.mint.creditum,
                        'address'
                    )
                }

                const [
                    totalMinted,
                    stabilizerDeposits,
                    userData,
                    collateralData,
                    stabilizerData,
                    priceUsd,
                    positionData,
                    liquidationPrice,
                    utilizationRatio,
                    contractBalance
                ] = await Promise.all([
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
                let tvl, totalUserDeposits, totalUserDebt
                tvl = totalUserDeposits = totalUserDebt = 0
                for (let i = 0; i < collateralData.length; i++) {
                    const marketData = formatCreditumData(
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
                        contractBalance ? contractBalance[i][0] : null
                    )
                    formattedAssetData.push(marketData)
                    tvl += Number(marketData.contractBalance) * marketData.priceUsd
                    totalUserDeposits = Number(marketData.userDeposits) * marketData.priceUsd
                    totalUserDebt = Number(marketData.positionDebtValue)
                }

                formattedCreditumData[assetIds[i]] = {
                    collaterals: formattedAssetData,
                    mintToken: { ...cTokenBalances[0], ...assetData.mint },
                    assetOverview: {
                        tvl,
                        totalUserDeposits,
                        totalUserDebt,
                        totalMinted: cTokenBalances[0].totalSupply
                    }
                }
            }

            const govTokenPrice = await getPrice('0x77128DFdD0ac859B33F44050c6fa272F34872B5E')
            const govTokenData = await getGovTokenData(govTokenPrice)
            govTokenData.tokenPrice = govTokenPrice

            console.log('refreshing collaterals result ===== ')
            setGovTokenData(govTokenData)
            setCreditumData(formattedCreditumData)
            setRefreshing(false)
        }
        fetchData()
    }, [account, slowRefresh, refresh])

    return {
        creditumData,
        govTokenData,
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

    const [depositInput, setDepositInput] = useState('')
    const [borrowInput, setBorrowInput] = useState('')
    const [repayInput, setRepayInput] = useState('')
    const [withdrawInput, setWithdrawInput] = useState('')

    const [liquidationPriceDeposit, setLiquidationPriceDeposit] = useState(0)
    const [healthDeposit, setHealthDeposit] = useState(0)
    const [newBorrowPercentDeposit, setNewBorrowPercentDeposit] = useState(0)

    const [liquidationPriceRepay, setLiquidationPriceRepay] = useState(0)
    const [healthRepay, setHealthRepay] = useState(0)
    const [newBorrowPercentRepay, setNewBorrowPercentRepay] = useState(0)

    const borrowPercent = (selectedMarket?.positionDebtValue * 100) / (selectedMarket?.positionCollateralValue * selectedMarket?.collateralMaxDebtRatio)

    return (
        <>
            <VeCreditDataWrapper>
                <FarmDataWrapper>
                    <CreditumContext.Provider
                        value={{
                            ...creditumData,
                            selectedMarket,
                            setSelectedMarket,
                            depositInput,
                            setDepositInput,
                            borrowInput,
                            setBorrowInput,
                            repayInput,
                            setRepayInput,
                            withdrawInput,
                            setWithdrawInput,
                            showMoreInfo,
                            setShowMoreInfo,
                            showDepositTool,
                            setShowDepositTool,
                            showRepayTool,
                            setShowRepayTool,
                            liquidationPriceDeposit,
                            setLiquidationPriceDeposit,
                            healthDeposit,
                            setHealthDeposit,
                            borrowPercent,
                            newBorrowPercentDeposit,
                            setNewBorrowPercentDeposit,
                            liquidationPriceRepay,
                            setLiquidationPriceRepay,
                            healthRepay,
                            setHealthRepay,
                            newBorrowPercentRepay,
                            setNewBorrowPercentRepay
                        }}
                    >
                        <>{children}</>
                    </CreditumContext.Provider>
                </FarmDataWrapper>
            </VeCreditDataWrapper>
        </>
    )
}

export default function useCreditumData() {
    return useContext(CreditumContext) as any
}
