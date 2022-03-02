import MeshBackground from './MeshBackground'
import { motion } from 'framer-motion'

export default function HomepageBackground() {
    return (
        <>
            <MeshBackground id="blue-gradient" className="filter blur-2xl" />
            <div className="bg-black fixed inset-0 bg-opacity-80" />
            <motion.div
                animate={{ opacity: [0, 0.05, 0] }}
                transition={{ duration: 24, loop: Infinity }}
                className="fixed inset-0 bg-cover opacity-5"
                style={{ backgroundImage: `url("/img/bg-lines.png")` }}
            />
        </>
    )
}
