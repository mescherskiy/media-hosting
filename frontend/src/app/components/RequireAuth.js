import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { selectCurrentUser } from "../slices/authSlice";

const RequireAuth = () => {
    const user = useSelector(selectCurrentUser);

    if (!user) {
        <Navigate to="/" replace={true} />
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Outlet />
        </motion.div>
    ) 
}

export default RequireAuth;