import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Portal from './Portal'

export default function Modal({ visible, onClose, children, style }) {
    return (
        <Portal>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-90 p-6"
                        onClick={() => onClose()}
                    >
                        <motion.div
                            initial={{ translateY: '-3%' }}
                            animate={{ translateY: '0%' }}
                            exit={{ translateY: '-3%' }}
                            className={classNames(
                                'max-w-lg w-full p-6 shadow-2xl bg-neutral-900  border-2 border-neutral-800 rounded-2xl overflow-auto'
                            )}
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
