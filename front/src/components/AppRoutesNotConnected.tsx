import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider';

const AppRoutesNotConnected = () => {
    const { user } = useAuth();
    return(
        user? <Outlet/> : <Navigate to="/"/>
    )
}

export default AppRoutesNotConnected