import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CookWithVindhya from './pages/CookWithVindhya';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';

import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReports from './pages/admin/AdminReports';
import AdminCoupons from './pages/admin/AdminCoupons';

import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerOverview from './pages/customer/CustomerOverview';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerProfile from './pages/customer/CustomerProfile';

import './index.css';

const DASHBOARD_PATHS = ['/admin', '/customer'];

function Layout({ children }) {
  const path = window.location.pathname;
  const hide = DASHBOARD_PATHS.some(p => path.startsWith(p) && path !== '/admin');
  return hide ? <>{children}</> : (<><Header /><main>{children}</main><Footer /></>);
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cook" element={<CookWithVindhya />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />

            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/profile" element={<CustomerProfile />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>

            {/* Customer Panel */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route path="dashboard" element={<CustomerOverview />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}
