import { Link, Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import { AnimatePresence, motion } from "framer-motion"

const RootLayout = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="d-flex flex-column justify-content-center px-5">
                <NavBar />
            </header>
            <main>
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </main>
            <footer className="d-flex justify-content-center align-items-center">
                Copyright © 2024 Media Vault. Built by&nbsp;<Link to="https://www.linkedin.com/in/alexandr-mescherskiy/" className="copyright-name text-decoration-none">Oleksandr Meshcherskyi</Link>
            </footer>
        </motion.div>
    )
}

export default RootLayout