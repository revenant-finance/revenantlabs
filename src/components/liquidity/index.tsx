import classNames from 'classnames'
import Bar from '../Bar/Bar'
import { formatter, isNotEmpty } from '../../utils'
import useSingularityLiquidity from '../../hooks/useLiquidity'
import { useSingularityData } from '../../Singularity/SingularityAppWrapper'
import SingularityLiquidityModal from './SingularityLiquidityModal'

export default function SingularityLiquidity() {
    const { tokens } = useSingularityData()
    const { setSelectedLp } = useSingularityLiquidity()

    const orderedTokens = tokens
        ?.sort((a, b) => {
            const getTokenBalance = (token) => token.pricePerShare * token.walletBalance
            return getTokenBalance(b) - getTokenBalance(a)
        })
        ?.sort((a, b) => {
            const getTokenBalance = (token) => token.pricePerShare * token.lpBalance.walletBalance
            return getTokenBalance(b) - getTokenBalance(a)
        })

    const isLoading = !orderedTokens?.length

    return (
        <>
            <SingularityLiquidityModal />

            <div className="max-w-5xl mx-auto space-y-4">
                {isLoading && (
                    <div className="w-full p-12 text-center">
                        <i className="text-2xl opacity-25 fas fa-circle-notch fa-spin" />
                    </div>
                )}

                {!isLoading && (
                    <>
                        <div>
                            <p className="text-xl font-medium opacity-75">
                                Select a pool to manage your liquidity.
                            </p>
                        </div>

                        {orderedTokens?.map((token, index) => {
                            return (
                                <button
                                    key={token.address}
                                    onClick={() => setSelectedLp(token.id)}
                                    className="w-full p-6 overflow-auto text-left transition-all transform bg-opacity-75 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-xl whitespace-nowrap hover:bg-opacity-100"
                                >
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center flex-1 w-full gap-4">
                                            <img
                                                className="w-12"
                                                src={`/img/tokens/${token.asset}`}
                                                alt=""
                                            />
                                            <div className="space-y-2">
                                                <div className="font-medium">
                                                    <p className="space-x-2 text-lg md:text-2xl">
                                                        <span>{token.name}</span>
                                                        <span className="text-sm opacity-25 md:text-lg">
                                                            ${formatter(token.tokenPrice)}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="hidden w-32 md:block">
                                                    <Bar value={token.collatRatio * 100} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden gap-4 md:flex">
                                            <div
                                                className={classNames(
                                                    'text-center font-medium py-2 px-4 rounded border-2 border-neutral-800'
                                                )}
                                            >
                                                <p className="text-2xl">
                                                    {formatter(token.lpUnderlyingBalance)}{' '}
                                                    {token.symbol}
                                                </p>
                                                <p className="text-sm opacity-50">Pool Deposits</p>
                                            </div>
                                            <div
                                                className={classNames(
                                                    'text-center font-medium py-2 px-4 rounded border-2 border-neutral-800',
                                                    isNotEmpty(token.lpBalance.walletBalance) &&
                                                        'bg-gradient-to-br from-purple-900 to-blue-900'
                                                )}
                                            >
                                                <p className="text-2xl">
                                                    {formatter(
                                                        token.pricePerShare *
                                                            token.lpBalance.walletBalance
                                                    )}{' '}
                                                    {token.symbol}
                                                </p>
                                                <p className="text-sm opacity-50">Your Deposits</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </>
                )}
            </div>
        </>
    )
}
