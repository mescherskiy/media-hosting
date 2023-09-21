import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { selectCurrentUser } from "../slices/authSlice";

const RequireAuth = () => {
    const user = useSelector(selectCurrentUser);
    const location = useLocation();

    let content = user
        ? <Outlet />
        : <Navigate to="/" state={{ from: location }} replace />

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {content}
        </motion.div>
    ) 
}

export default RequireAuth;