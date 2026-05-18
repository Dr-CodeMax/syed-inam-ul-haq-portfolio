import { Navigate } from "react-router-dom";

import Loader from "../components/Loader";

import useAuthStore from "../store/authStore";

const RoleGuard = ({
    children,
    allowedRoles = [],
}) => {

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuthStore();

    // ===================================================
    // 🔥 LOADING STATE
    // ===================================================

    if (loading) {
        return <Loader />;
    }

    // ===================================================
    // 🔥 NOT LOGGED IN
    // ===================================================

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ===================================================
    // 🔥 ROLE CHECK
    // ===================================================

    const hasAccess =
        allowedRoles.includes(user?.role);

    // ===================================================
    // 🔥 ACCESS DENIED
    // ===================================================

    if (!hasAccess) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // ===================================================
    // 🔥 ACCESS GRANTED
    // ===================================================

    return children;
};

export default RoleGuard;