import { Navigate, Outlet } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
