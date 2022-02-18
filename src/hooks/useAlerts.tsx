import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { createContext, useContext, useState } from 'react'

const AlertsContext = createContext({})

export function UseAlertsWrapper({ children }) {
    const [alerts, setAlerts] = useState([])

    const clearAlert = (id) => {
        setAlerts((_) => _.filter((alert) => alert.id !== id))
    }

    const newAlert = (props) => {
        const id = nanoid()
        const newAlertItem = { id, ...props }
        setAlerts((_) => [..._, newAlertItem])
        setTimeout(() => clearAlert(id), 3000)
        return id
    }
    return (
        <AlertsContext.Provider value={{ newAlert, clearAlert }}>
            <>
                <AnimatePresence>
                    <div className="fixed z-50 w-full max-w-xs space-y-2 bottom-6 right-6">
                        {alerts.map((alert) => (
                            <motion.div className="bg-neutral-700 p-4 shadow-2xl rounded" initial={{ x: '100%' }} animate={{ x: '0' }} exit={{ x: '100%' }}>
                                <p className={classNames('font-medium', alert.mood === 'negative' && 'text-red-500')}>{alert.title}</p>
                                <p className="text-xs">{alert.subtitle}</p>
                            </motion.div>
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
