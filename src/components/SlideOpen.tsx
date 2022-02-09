import classNames from 'classnames'
import { motion } from 'framer-motion'

export default function SlideOpen(props) {
    return (
        <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            transition={{ duration: 0.2 }}
            variants={{
                open: { height: 'auto' },
                collapsed: { height: 0 }
            }}
            className={classNames('overflow-hidden', props.className)}
        >
            {props.children}
        </motion.div>
    )
}
