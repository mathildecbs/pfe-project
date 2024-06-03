import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider';

const AppRoutesPrivate = () => {
    const { user } = useAuth();
    return(
        user? <Outlet/> : <Navigate to="/login"/>
    )
}

export default AppRoutesPrivate