import { createContext, useContext, useEffect, useState } from 'react'
import nanoid from 'nanoid'
import { AnimatePresence } from 'framer-motion'
import LoaderModal from '../components/LoaderModal'
import useCreditumData from './Creditum/useCreditumData'

const AlertsContext = createContext({})

export function UseAlertsWrapper({ children }) {
    const [transactions, setTransactions] = useState([])
    const { refreshing } = useCreditumData()

    useEffect(() => {
        if (refreshing) {
            console.log('market refreshing ================================')
        }
    }, [refreshing])
    
    const triggerTransactionAlert = (tx) => {
        const newTransaction = {
            tx
        }

        setTransactions((currentTransactions) => [...currentTransactions, newTransaction])
    }

    const completeTransactionAlert = (tx) => {
        const find = transactions.find((transaction) => transaction.tx === tx)
        if (!find) return

        find.complete = true
        const filtered = transactions.filter((transaction) => transaction.tx !== tx)

        setTransactions([...filtered, find])
    }
    const deleteTransactionAlert = (tx) => {
        completeTransactionAlert(tx)

        // setTimeout(() => {
        const filtered = transactions.filter((transaction) => transaction.tx !== tx)
        setTransactions(filtered)
        // }, 2000)
    }

    return (
        <AlertsContext.Provider
            value={{
                transactions,
                setTransactions,
                triggerTransactionAlert,
                deleteTransactionAlert,
                completeTransactionAlert
            }}
        >
            <>
                <AnimatePresence>
                    <div className="fixed z-50 w-full max-w-xs space-y-2 bottom-6 right-6">
                        {transactions.map((transaction, index) => (
                            <LoaderModal tx={transaction.tx} complete={transaction.complete} key={index} />
                        ))}
                    </div>
                </AnimatePresence>

                {children}
            </>
        </AlertsContext.Provider>
    )
}

export default function useAlerts() {
    const context = useContext(AlertsContext)
    return { ...context }
}
