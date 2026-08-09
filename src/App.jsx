import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store/store";
import { fetchProducts } from "./store/productsSlice";
import { refreshSession, selectCurrentUser } from "./store/authSlice";
import { syncCartWithServer, cartReset } from "./store/cartSlice";
import { getToken } from "./services/api";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";

function AppShell() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const syncedUserId = useRef(null);

  useEffect(() => {
    // Load the catalogue from the backend once on boot, and revalidate any
    // cached login session against the server.
    dispatch(fetchProducts());
    if (getToken()) dispatch(refreshSession());
  }, [dispatch]);

  useEffect(() => {
    // Whenever we land on a signed-in user (login, signup, or a cached
    // session getting revalidated on boot), fold any guest cart into their
    // account cart in MongoDB and treat the server as the source of truth
    // from then on. On logout, fall back to the (now-empty) guest cart.
    if (currentUser && syncedUserId.current !== currentUser.id) {
      syncedUserId.current = currentUser.id;
      dispatch(syncCartWithServer());
    } else if (!currentUser && syncedUserId.current !== null) {
      syncedUserId.current = null;
      dispatch(cartReset());
    }
  }, [currentUser, dispatch]);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/category/:catKey" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ManageProducts />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </Provider>
  );
}
