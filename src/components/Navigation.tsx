import { useState } from 'react'
import Portal from './Portal'
import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'

export default function Naviation() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="fixed top-0 right-0 p-2 md:p-6 z-30 pointer-events-none max-w-lg w-full flex flex-col items-end gap-2">
                <div className="flex justify-end">
                    <button onClick={() => setOpen((_) => !_)} className={classNames('pointer-events-auto bg-zinc-900 border-2 border-zinc-800 rounded-full px-4 py-2 shadow-2xl')}>
                        <i className={classNames('fas fa-bars transition ease-in-out duration-75', open && 'rotate-90 text-orange-500')}></i>
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: '120%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '120%' }}
                            className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 pointer-events-auto space-y-4"
                        >
                            <div className="space-y-2">
                                <a className="bg-orange-500 block text-center p-2 font-medium text-orange-900 rounded" href="">
                                    Open Creditum
                                </a>
                                <a className="bg-blue-500 block text-center p-2 font-medium text-blue-900 rounded" href="">
                                    Open Creditum
                                </a>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-1">
                                    <a href="# " className="font-mono underline opacity-50 hover:opacity-100">
                                        Support
                                    </a>
                                </div>
                                <p className="text-center space-x-2">
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-twitter" />
                                    </a>
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-discord" />
                                    </a>
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-github" />
                                    </a>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
