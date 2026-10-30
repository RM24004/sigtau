import { Navigate } from "react-router-dom";
import { isSessionValid, homeFor, clearSession } from "../utils/auth";

/** Exige sesión válida y, opcionalmente, uno de los roles indicados. */
function ProtectedRoute({ roles, children }) {
    if (!isSessionValid()) {
        clearSession();
        return <Navigate to="/login" replace />;
    }
    const role = localStorage.getItem("role");
    if (roles && !roles.includes(role)) {
        return <Navigate to={homeFor(role)} replace />;
    }
    return children;
}

export default ProtectedRoute;
