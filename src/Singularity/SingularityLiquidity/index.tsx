import classNames from 'classnames'
import useSingularityLiquidity from '../hooks/useSingularityLiquidity'
import { formatter, isNotEmpty } from '../../utils'
import Bar from '../../components/Bar/Bar'
import DataPoint from '../../components/DataPoint/DataPoint'
import { useSingularityData } from '../SingularityAppWrapper'
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
                                                    <p className="opacity-50 md:text-xl">
                                                        <span>
                                                            $
                                                            {formatter(
                                                                token.lpUnderlyingBalance *
                                                                    token.tokenPrice
                                                            )}
                                                        </span>
                                                        <span> Deposited in Pool</span>
                                                    </p>
                                                </div>

                                                <div className="hidden w-32 md:block">
                                                    <Bar value={token.collatRatio * 100} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-2 md:hidden">
                                            <Bar value={token.collatRatio * 100} />
                                            <div>
                                                <DataPoint
                                                    title="Your Balance"
                                                    value={`$${formatter(
                                                        token.pricePerShare * token.walletBalance
                                                    )}`}
                                                />
                                                <DataPoint
                                                    title="Your Deposits"
                                                    value={`$${formatter(
                                                        token.pricePerShare *
                                                            token.lpBalance.walletBalance
                                                    )}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="hidden gap-4 md:flex">
                                            <div
                                                className={classNames(
                                                    'text-center font-medium py-2 px-4 rounded border-2 border-neutral-800'
                                                )}
                                            >
                                                <p className="text-2xl">
                                                    {formatter(
                                                        token.pricePerShare * token.walletBalance
                                                    )}{' '}
                                                    {token.symbol}
                                                </p>
                                                <p className="text-sm opacity-50">Your Balance</p>
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

                {/* <div className="overflow-auto bg-opacity-75 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-xl whitespace-nowrap">
                    {!isLoading && (
                        <table className="w-full table-auto bg-neutral-900">
                            <thead className="text-left">
                                <tr className="opacity-25">
                                    <th className="p-2">Asset</th>
                                    <th>Your Balance</th>
                                    <th>Pool Size</th>
                                    <th>Collateralization Ratio</th>
                                    <th>Assets</th>
                                    <th>Liabilities</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {orderedTokens?.map((token, index) => {
                                    const isOdd = index % 2 === 0
                                    return (
                                        <tr className={isOdd ? 'bg-neutral-800' : 'bg-neutral-900'}>
                                            <td className="p-2">
                                                <p>
                                                    <img
                                                        className="inline w-6 h-6 mr-2"
                                                        src={`/img/tokens/${token.asset}`}
                                                        alt=""
                                                    />
                                                    <span>{token.name}</span>
                                                </p>
                                            </td>
                                            <td>
                                                $
                                                {commaFormatter(
                                                    token.pricePerShare *
                                                        token.lpBalance.walletBalance
                                                )}
                                            </td>
                                            <td>
                                                $
                                                {commaFormatter(
                                                    token.lpUnderlyingBalance * token.tokenPrice
                                                )}
                                            </td>
                                            <td>{commaFormatter(token.collatRatio)}</td>
                                            <td>
                                                {commaFormatter(token.assetAmount)} {token.symbol}
                                            </td>
                                            <td>{commaFormatter(token.liabilityAmount)}</td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => setSelectedLp(token)}
                                                    className="font-medium text-transparent bg-gradient-to-br from-purple-500 to-blue-500 bg-clip-text"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div> */}
            </div>
        </>
    )
}
