import { AnimatePresence, motion } from 'framer-motion'
import Portal from './Portal'

export default function Modal({ visible, onClose, children }) {
    return (
        <Portal>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6"
                        onClick={() => onClose()}
                    >
                        <motion.div
                            initial={{ translateY: '-20%' }}
                            animate={{ translateY: '0%' }}
                            exit={{ translateY: '-20%' }}
                            className="bg-zinc-900 max-w-lg shadow-2xl w-full rounded p-6 overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Portal>
    )
}
