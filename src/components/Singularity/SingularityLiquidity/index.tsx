import classNames from 'classnames'
import useSingularityLiquidity from '../../../hooks/useSingularityLiquidity'
import { formatter, isNotEmpty } from '../../../utils'
import DataPoint from '../../DataPoint'
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
                    <div className="p-12 w-full text-center">
                        <i className="fas fa-circle-notch fa-spin text-2xl opacity-25" />
                    </div>
                )}

                {!isLoading && (
                    <>
                        <div>
                            <p className="opacity-75 font-medium text-xl">
                                Select a pool to manage your liquidity.
                            </p>
                        </div>

                        {orderedTokens?.map((token, index) => {
                            return (
                                <button
                                    key={token.address}
                                    onClick={() => setSelectedLp(token)}
                                    className="w-full text-left border-2 shadow-2xl bg-neutral-900 border-neutral-800 bg-opacity-75 rounded-xl whitespace-nowrap overflow-auto p-6 transition-all transform hover:-translate-y-1"
                                >
                                    <div className="flex gap-4 flex-wrap">
                                        <div className="w-full flex-1 flex items-center gap-4">
                                            <img
                                                className="w-12"
                                                src={`/img/tokens/${token.asset}`}
                                                alt=""
                                            />
                                            <div className="font-medium">
                                                <p className="text-2xl space-x-2">
                                                    <span>{token.name}</span>
                                                    <span className="text-lg opacity-25">
                                                        ${formatter(token.tokenPrice)}
                                                    </span>
                                                </p>
                                                <p className="text-xl opacity-50">
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
                                        </div>

                                        <div className="md:hidden w-full">
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
                                        <div className="hidden md:flex gap-4">
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

                {/* <div className="border-2 shadow-2xl bg-opacity-75 bg-neutral-900 border-neutral-800 rounded-xl whitespace-nowrap overflow-auto">
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
                                                        className="w-6 h-6 inline mr-2"
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
                                                    className="bg-gradient-to-br from-purple-500 to-blue-500 text-transparent bg-clip-text font-medium"
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
