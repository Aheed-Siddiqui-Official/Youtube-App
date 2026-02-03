import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AppSkeleton from "../ui/AppSkeleton";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

//   if (!authChecked) return <AppSkeleton />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
