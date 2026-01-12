import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
import { fetchCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // On app load, fetch current user using the cookie-based auth
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
