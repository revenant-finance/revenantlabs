import useSingularity from '../../../hooks/useSingularity'
import SingularityLiquidityModal from './SingularityLiquidityModal'
import { commaFormatter } from '../../../utils'

export default function SingularityLiquidity() {
    const { selectedLp, setSelectedLp, tokens, data } = useSingularity()

    return (
        <>
            <SingularityLiquidityModal />

            <div className="max-w-5xl mx-auto">
                <div>
                    <div className="flex">
                        <p className="flex-1">Deposits</p>
                        <button>Claim Rewards</button>
                    </div>
                    <table className="w-full table-auto bg-neutral-900">
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Amount</th>
                                <th>Volume (24H)</th>
                                <th>Coverage</th>
                                <th>Base + Boost APR</th>
                                <th>Pending</th>
                                <th>...</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tokens?.map((token) => (
                                <tr>
                                    <td className="flex space-x-2">
                                        <img
                                            className="w-6 h-6"
                                            src={`/img/tokens/${token.asset}`}
                                            alt=""
                                        />
                                        <p>{token.name}</p>
                                    </td>
                                    <td>{commaFormatter(token.pricePerShare * token.lpBalance.walletBalance)}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedLp(token)}
                                            className="text-white bg-purple-500"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="max-w-5xl mx-auto">
                <div>
                    <div className="flex">
                        <p className="flex-1">Deposits</p>
                        <button>Claim Rewards</button>
                    </div>
                    <table className="w-full table-auto bg-neutral-900">
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Pool Size</th>
                                <th>Volume (24H)</th>
                                <th>Coverage</th>
                                <th>Base + Boost APR</th>
                                <th>Reward</th>
                                <th>...</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tokens?.map((token) => (
                                <tr>
                                    <td className="flex space-x-2">
                                        <img
                                            className="w-6 h-6"
                                            src={`/img/tokens/${token.asset}`}
                                            alt=""
                                        />
                                        <p>{token.name}</p>
                                    </td>
                                    <td>${commaFormatter(token.lpUnderlyingBalance * token.tokenPrice)}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedLp(token)}
                                            className="text-white bg-purple-500"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
