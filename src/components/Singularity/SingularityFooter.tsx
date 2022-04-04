import { motion } from 'framer-motion'

export default function SingularityFooter() {
    return (
        <div className="relative z-10 flex justify-center items-center p-12">
            <motion.img
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, loop: Infinity }}
                className="w-32"
                src="/img/singularity-token.png"
            />
        </div>
    )
}
