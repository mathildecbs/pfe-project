import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider';

const AppRoutesPrivate = () => {
    const { user } = useAuth();
    return(
        user? <Outlet/> : <Navigate to="/login"/>
    )
}

export default AppRoutesPrivate