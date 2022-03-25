import useSingularity from '../../../hooks/useSingularity'
import SingularityLiquidityModal from './SingularityLiquidityModal'

export default function SingularityLiquidity() {
    const { selectedLp, setSelectedLp, tokens } = useSingularity()

    return (
        <>
            <SingularityLiquidityModal />

            <div className="max-w-5xl mx-auto">
                <div>
                    <div className="flex">
                        <p className="flex-1">Deposits</p>
                        <button>Claim Rewards</button>
                    </div>
                    <table className="w-full bg-neutral-900 table-auto">
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

                        <p className="w-32 overflow-hidden">{JSON.stringify(selectedLp)}</p>

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
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>{`?????`}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedLp(token)}
                                            className="bg-purple-500 text-white"
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
