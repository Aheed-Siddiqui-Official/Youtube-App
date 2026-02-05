import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
import { fetchCurrentUser } from "./store/slices/authSlice";
import AppSkeleton from "./components/ui/AppSkeleton";

function App() {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);
  const authCheckRef = useRef(false);

  // Restore auth session on app mount (only once)
  useEffect(() => {
    if (!authCheckRef.current) {
      authCheckRef.current = true;
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  // STOP UI until auth known
  if (!authChecked) {
    return <AppSkeleton />;
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
