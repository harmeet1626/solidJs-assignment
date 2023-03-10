import { Routes, Route, useNavigate, useLocation } from "@solidjs/router";
import Login from "../pages/login";
import Home from "../pages/Home";
import { isLogin, setisLogin } from "../pages/login";
import Category from "../pages/Category";
import Allproducts from "../pages/Allproducts";
import ProductsDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import productsByCategory from "../pages/ProductByCategory";
const routes = () => {
  const navigate = useNavigate();
  function requireAuth(component) {
    if (!isLogin()) {
      navigate("/login");
      return null;
    }
    return component;
  }
  return (
    <>
      <Routes>
        <Route path="/login" component={Login} />
        <Route path="/" component={(Home)} />
        <Route path="/category" component={(Category)} />
        <Route path="/allProducts" component={(Allproducts)} />
        <Route
          path="/ProductsDetails/:id"
          component={(ProductsDetails)}
        />
        <Route path="/Cart" component={(Cart)} />
        <Route
          path="/productsByCategory/:category"
          component={(productsByCategory)}
        />
      </Routes>
    </>
  );
};
export default routes;
