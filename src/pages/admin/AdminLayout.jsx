import { useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiUsers, FiLogOut, FiTag } from 'react-icons/fi';
import logo from '../../assets/logo3.png';
import '../Dashboard.css';

const tabs = [
  { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { path: '/admin/products', icon: <FiShoppingBag />, label: 'Products' },
  { path: '/admin/orders', icon: <FiPackage />, label: 'Orders' },
  { path: '/admin/customers', icon: <FiUsers />, label: 'Customers' },
  { path: '/admin/coupons', icon: <FiTag />, label: 'Coupons' },
  { path: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/admin');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  const activeLabel = tabs.find(t => location.pathname === t.path)?.label || 'Admin';

  return (
    <div className="dash-page admin-dash">
      <aside className="dash-sidebar admin-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-logo">
            <img src={logo} alt="Vindhya Pickles" className="dash-brand-logo-img" />
          </div>
          <div>
            <div className="dash-brand-name">Vindhya Pickles</div>
            <div className="dash-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="dash-nav">
          {tabs.map(t => (
            <Link key={t.path} to={t.path}
              className={`dash-nav-item ${location.pathname === t.path ? 'active' : ''}`}>
              {t.icon} {t.label}
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-nav-item logout" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <h1 className="dash-page-title">{activeLabel}</h1>
          <span className="dash-admin-badge">Admin</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
