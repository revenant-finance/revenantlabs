import { useEffect, useState } from 'react'
import InfoBanner from '../../components/Banners/InfoBanner'
import Button from '../../components/Btns/Button'
import Input from '../../components/Inputs/Input'
import { useActiveWeb3React } from '../../hooks'
import useAlerts from '../../hooks/useAlerts'
import { MAX_UINT256, smartNumberFormatter, toEth, toWei, EMPTY_ADDRESS } from '../../utils'
import {
    fetchBalances,
    getCreditumContract,
    getTokenContract,
    getUnitrollerContract
} from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import { CONTRACT_CONTROLLER_ABI, CONTRACT_CREDITUM, CONTRACT_CREDITUM_ABI } from '../data'

const creditumABI = JSON.parse(CONTRACT_CREDITUM_ABI)
const controllerABI = JSON.parse(CONTRACT_CONTROLLER_ABI)

const tokenData = {
    dai: CONTRACT_CREDITUM[250].cToken.cusd.collaterals.dai,
    usdc: CONTRACT_CREDITUM[250].cToken.cusd.collaterals.usdc
}

const cusdData = CONTRACT_CREDITUM[250].cToken.cusd.mint

function Radio({ stablecoin, setStableCoin, stabilizerData }) {
    console.log(stablecoin)
    const handleOptionChange = (e) => {
        const stable = stabilizerData.find((token) => token.symbol === e.target.value)
        setStableCoin(stable)
    }

    return (
        <div className="flex flex-col items-start justify-start">
            <div className="flex items-center w-full space-x-2">
                <input
                    type="radio"
                    value="USDC"
                    name="stable"
                    checked={stablecoin.symbol === 'USDC'}
                    onChange={handleOptionChange}
                />{' '}
                <p className="">USDC</p>
            </div>
            <div className="flex items-center w-full space-x-2">
                <input
                    type="radio"
                    value="DAI"
                    name="stable"
                    checked={stablecoin.symbol === 'DAI'}
                    onChange={handleOptionChange}
                />{' '}
                <p className="">DAI</p>
            </div>
        </div>
    )
}

export default function CreditumStabilizer() {
    const { account, library } = useActiveWeb3React()
    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)
    const unitroller = getUnitrollerContract('0x07F961C532290594FA1A08929EB5557346a7BB9C', library)
    const creditum = getCreditumContract('0x04d2c91a8bdf61b11a526abea2e2d8d778d4a534', library)
    const tokenContract = getTokenContract(cusdData.address, library)
    const [stabilizerData, setStabilizerData] = useState({})
    const [stablecoin, setStableCoin] = useState(tokenData.usdc)
    const [cUSD, setCUSD] = useState(cusdData)
    const [depositStatus, setDepositStatus] = useState('idle')
    const [withdrawStatus, setWithdrawStatus] = useState('idle')
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const { newAlert } = useAlerts()

    const tokens = Object.values(tokenData)

    useEffect(() => {
        getStabilizerData()
    }, [account, refresh])

    const getStabilizerData = async () => {
        const depositCalls = tokens.map((token) => ({
            address: creditum.address,
            name: 'stabilizerDeposits',
            params: [token.address]
        }))

        const stabilizerDataCalls = tokens.map((token) => ({
            address: unitroller.address,
            name: 'stabilizerData',
            params: [token.address]
        }))

        const [deposits, stabilizer, balances, cusdBal] = await Promise.all([
            multicall(creditumABI, depositCalls),
            multicall(controllerABI, stabilizerDataCalls),
            account
                ? fetchBalances(account, tokens, creditum.address, 'address')
                : fetchBalances(EMPTY_ADDRESS, tokens, creditum.address, 'address'),
            account ? tokenContract.balanceOf(account) : tokenContract.balanceOf(EMPTY_ADDRESS)
        ])

        const data = tokens.map((token, i) => {
            return {
                ...token,
                deposits: toEth(deposits[i][0], token.decimals),
                fee: toEth(stabilizer[i].stabilizerFee),
                ...balances[i]
            }
        })

        setStabilizerData(data)
        data && setStableCoin(data.find((token) => token.symbol === 'USDC'))
        setCUSD({
            ...cusdData,
            walletBalance: toEth(cusdBal)
        })
    }

    const onDeposit = async () => {
        try {
            if (account) {
                setDepositStatus('loading')
                newAlert({
                    title: 'Minting cUSD...',
                    subtitle: 'Please complete the rest of the transaction on your wallet.'
                })
                let tx = null
                const creditumContract = getCreditumContract(
                    '0x04d2c91a8bdf61b11a526abea2e2d8d778d4a534',
                    library?.getSigner()
                )
                const tokenContract = getTokenContract(stablecoin.address, library?.getSigner())
                try {
                    if (Number(stablecoin?.allowBalance) < Number(depositAmount)) {
                        tx = await tokenContract.approve(creditumContract.address, MAX_UINT256)
                    } else {
                        tx = await creditumContract.stabilizerMint(
                            stablecoin.address,
                            toWei(depositAmount, stablecoin?.decimals)
                        )
                    }
                    await tx.wait(1)
                    update()
                } catch (error) {
                    console.log(error)
                }

                setDepositStatus('idle')
                newAlert({
                    title: 'Mint Complete',
                    subtitle: 'Process complete. Your cUSD have been sent to your wallet.'
                })
            } else {
                newAlert({
                    title: 'Wallet Not Connected',
                    subtitle: 'Please connect your wallet before transacting.',
                    mood: 'negative'
                })
            }
        } catch (error) {
            newAlert({
                title: 'Minting Failed',
                subtitle: 'An error occurred. Please try again',
                mood: 'negative'
            })
            setDepositStatus('error')
        }
    }

    const onWithdraw = async () => {
        try {
            if (account) {
                setWithdrawStatus('loading')
                newAlert({
                    title: 'Redeeming rewards...',
                    subtitle: 'Please complete the rest of the transaction on your wallet.'
                })
                try {
                    let tx = null
                    const creditumContract = getCreditumContract(
                        '0x04d2c91a8bdf61b11a526abea2e2d8d778d4a534',
                        library?.getSigner()
                    )
                    tx = await creditumContract.stabilizerRedeem(
                        stablecoin.address,
                        toWei(withdrawAmount)
                    )
                    await tx.wait(1)
                    update()
                } catch (error) {
                    console.log(error)
                }

                setWithdrawStatus('idle')
                newAlert({
                    title: 'Redeem Complete',
                    subtitle: `Process complete. Your ${stablecoin.symbol} have been sent to your wallet.`
                })
            } else {
                newAlert({
                    title: 'Wallet Not Connected',
                    subtitle: 'Please connect your wallet before transacting.',
                    mood: 'negative'
                })
            }
        } catch (error) {
            newAlert({
                title: 'Redeem Failed',
                subtitle: 'An error occurred. Please try again',
                mood: 'negative'
            })
            setWithdrawStatus('error')
        }
    }

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner
                header="Stabilizer"
                title="Convert between cUSD and USDC 1:1"
                subtitle="To support the peg cUSD, the stabilizer page serves to allow conversion of 1 USDC for 1 cUSD when the cUSD2pool has low liquidity."
            />

            <div className="p-6 space-y-2 bg-opacity-50 border-2 shadow-2xl bg-neutral-800 border-neutral-800 rounded-2xl">
                <div className="flex flex-col gap-6 md:flex-row">
                    <Radio
                        stablecoin={stablecoin}
                        setStableCoin={setStableCoin}
                        stabilizerData={stabilizerData}
                    />
                    <div className="flex items-center justify-between w-full space-x-4">
                        <div className="w-full">
                            <div className="flex justify-between">
                                <p className="">Convert {stablecoin.symbol} to cUSD</p>
                                <p className="">
                                    {stablecoin.symbol} Balance:{' '}
                                    {smartNumberFormatter(stablecoin.walletBalance)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    value={depositAmount}
                                    onMax={() => setDepositAmount(stablecoin.walletBalance)}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                />
                                <Button
                                    onClick={() => onDeposit()}
                                    className="text-black bg-yellow-400"
                                >
                                    Mint cUSD
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between">
                                <p className="">Convert cUSD to {stablecoin.symbol}</p>
                                <p className="">
                                    cUSD Balance: {smartNumberFormatter(cUSD.walletBalance)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    value={withdrawAmount}
                                    onMax={() => setWithdrawAmount(cUSD.walletBalance)}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                />
                                <Button
                                    onClick={() => onWithdraw()}
                                    className="text-black bg-yellow-400"
                                >
                                    Redeem {stablecoin.symbol}{' '}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-2xl font-medium text-yellow-400">
                        Available reserves: {smartNumberFormatter(stablecoin.deposits)}{' '}
                        {stablecoin.symbol}
                    </p>
                    <p className="text-xs font-bold tracking-widest uppercase opacity-50">
                        Fee: {stablecoin.fee * 100}%
                    </p>
                </div>
            </div>
        </div>
    )
}
