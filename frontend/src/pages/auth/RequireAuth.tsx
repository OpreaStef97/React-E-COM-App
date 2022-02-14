import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequireAuth() {
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    let location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/auth" state={{ from: location }} />;
    }

    return <Outlet />;
}

export default RequireAuth;
