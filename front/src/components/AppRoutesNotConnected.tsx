import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider';

const AppRoutesNotConnected = () => {
    const { user } = useAuth();
    return(
        user? <Navigate to="/"/> : <Outlet/> 
    )
}

export default AppRoutesNotConnected