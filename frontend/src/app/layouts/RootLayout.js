import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import { AnimatePresence, motion } from "framer-motion"

const RootLayout = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header>
                <NavBar />
            </header>
            <main>
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </main>
            <footer></footer>
        </motion.div>
    )
}

export default RootLayout