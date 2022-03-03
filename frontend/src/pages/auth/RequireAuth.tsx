import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RequireAuth() {
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    let location = useLocation();
    const [whereToGo, setWhereToGo] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            setWhereToGo('/auth');
        }
    }, [isLoggedIn]);

    return (
        <>{whereToGo ? <Navigate to="/auth" state={{ from: location.pathname }} /> : <Outlet />}</>
    );
}

export default RequireAuth;
