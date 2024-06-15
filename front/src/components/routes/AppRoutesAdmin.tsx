import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider';

const AppRoutesAdmin = () => {
    const { user } = useAuth();
    return(
        user?.isAdmin? <Outlet/> : <Navigate to="/"/>
    )
}

export default AppRoutesAdmin