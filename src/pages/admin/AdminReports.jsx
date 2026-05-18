import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiDownload, FiFilter, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import API from '../../config';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

function getMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

function today() { return new Date().toISOString().split('T')[0]; }
function firstOfMonth() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; }

export default function AdminReports() {
  const monthOptions = getMonthOptions();
  const [filterMode, setFilterMode] = useState('month');
  const [from, setFrom] = useState(monthOptions[5].value);
  const [to, setTo] = useState(monthOptions[0].value);
  const [fromDate, setFromDate] = useState(firstOfMonth());
  const [toDate, setToDate] = useState(today());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    const params = filterMode === 'date'
      ? `fromDate=${fromDate}&toDate=${toDate}`
      : `from=${from}&to=${to}`;
    fetch(`${API}/reports?${params}`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { setReport(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const rangeLabel = filterMode === 'date' ? `${fromDate}_to_${toDate}` : `${from}_to_${to}`;

  const exportExcel = () => {
    if (!report?.ordersForExport?.length) return;
    const wb = XLSX.utils.book_new();
    const ordersData = report.ordersForExport.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.name || '—',
      'Email': o.email,
      'Mobile': o.mobile,
      'Total (₹)': parseFloat(o.total).toFixed(2),
      'Status': o.status,
      'Coupon': o.coupon || '—',
      'Address': o.address || '—',
      'Date': new Date(o.created_at).toLocaleDateString('en-IN'),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordersData), 'Orders');
    const monthlyData = report.monthlySales?.map(m => ({ 'Month': m.month, 'Orders': m.orders, 'Revenue (₹)': parseFloat(m.revenue).toFixed(2) }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthlyData), 'Monthly Summary');
    const productsData = report.topProducts?.map((p, i) => ({ 'Rank': i + 1, 'Product': p.product, 'Qty Sold': p.qty_sold }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsData), 'Top Products');
    XLSX.writeFile(wb, `Vindhya_Foods_Report_${rangeLabel}.xlsx`);
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFillColor(26, 20, 0);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(235, 184, 18);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('VINDHYA PICKLES & FOODS', pageW / 2, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(200, 180, 100);
    doc.text(`Sales Report: ${rangeLabel.replace(/_/g, ' ')}`, pageW / 2, 21, { align: 'center' });
    let y = 36;
    const totalRevenue = report.ordersForExport?.reduce((s, o) => s + parseFloat(o.total || 0), 0) || 0;
    const totalOrders = report.ordersForExport?.length || 0;
    doc.setTextColor(26, 20, 0); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, y); y += 6;
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [['Total Orders', totalOrders], ['Total Revenue', `Rs. ${totalRevenue.toFixed(2)}`], ['Total Customers', report.customerStats?.total_customers || 0], ['New This Month', report.customerStats?.new_this_month || 0]],
      theme: 'grid',
      headStyles: { fillColor: [26, 20, 0], textColor: [235, 184, 18], fontStyle: 'bold' },
      styles: { fontSize: 10 }, columnStyles: { 1: { fontStyle: 'bold' } },
    });
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Monthly Sales', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Month', 'Orders', 'Revenue (Rs.)']],
      body: report.monthlySales?.map(m => [m.month, m.orders, parseFloat(m.revenue).toFixed(2)]) || [],
      theme: 'striped', headStyles: { fillColor: [26, 20, 0], textColor: [235, 184, 18], fontStyle: 'bold' }, styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Top Products', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Rank', 'Product', 'Qty Sold']],
      body: report.topProducts?.map((p, i) => [i + 1, p.product, p.qty_sold]) || [],
      theme: 'striped', headStyles: { fillColor: [26, 20, 0], textColor: [235, 184, 18], fontStyle: 'bold' }, styles: { fontSize: 10 },
    });
    doc.addPage();
    doc.setFillColor(26, 20, 0); doc.rect(0, 0, pageW, 18, 'F');
    doc.setTextColor(235, 184, 18); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Order Details', pageW / 2, 12, { align: 'center' });
    autoTable(doc, {
      startY: 24,
      head: [['#', 'Customer', 'Mobile', 'Total', 'Status', 'Date']],
      body: report.ordersForExport?.map(o => [o.id, o.name || o.email?.split('@')[0] || '—', o.mobile, `Rs. ${parseFloat(o.total).toFixed(0)}`, o.status, new Date(o.created_at).toLocaleDateString('en-IN')]) || [],
      theme: 'striped', headStyles: { fillColor: [26, 20, 0], textColor: [235, 184, 18], fontStyle: 'bold' },
      styles: { fontSize: 9 }, columnStyles: { 3: { fontStyle: 'bold' } },
    });
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount} — Generated on ${new Date().toLocaleDateString('en-IN')}`, pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    }
    doc.save(`Vindhya_Foods_Report_${rangeLabel}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

      {/* Filter Bar */}
      <div className="reports-filter-bar">
        <div className="reports-filter-group">
          <FiFilter size={15} />

          <div className="reports-mode-toggle">
            <button className={filterMode === 'month' ? 'active' : ''} onClick={() => setFilterMode('month')}>Month</button>
            <button className={filterMode === 'date' ? 'active' : ''} onClick={() => setFilterMode('date')}>
              <FiCalendar size={12} /> Date
            </button>
          </div>

          {filterMode === 'month' ? (
            <>
              <label>From</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className="reports-month-select">
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <label>To</label>
              <select value={to} onChange={e => setTo(e.target.value)} className="reports-month-select">
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </>
          ) : (
            <>
              <label>From</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="reports-date-input" />
              <label>To</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="reports-date-input" />
            </>
          )}

          <button className="reports-apply-btn" onClick={load} disabled={loading}>
            <FiRefreshCw size={14} className={loading ? 'spin' : ''} />
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </div>

        <div className="reports-export-group">
          <button className="reports-export-btn excel" onClick={exportExcel} disabled={!report}>
            <FiDownload size={14} /> Excel
          </button>
          <button className="reports-export-btn pdf" onClick={exportPDF} disabled={!report}>
            <FiDownload size={14} /> PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="dash-loading-inline"><div className="dash-spinner" /></div>
      ) : report && (
        <div className="dash-reports-grid">
          <div className="dash-report-card">
            <h3>👥 Customer Stats</h3>
            <div className="dash-report-row"><span>Total Customers</span><strong>{report.customerStats?.total_customers}</strong></div>
            <div className="dash-report-row"><span>New This Month</span><strong>{report.customerStats?.new_this_month}</strong></div>
            <div className="dash-report-row"><span>Total Orders</span><strong>{report.ordersForExport?.length || 0}</strong></div>
            <div className="dash-report-row">
              <span>Total Revenue</span>
              <strong>₹{report.ordersForExport?.reduce((s, o) => s + parseFloat(o.total || 0), 0).toFixed(0)}</strong>
            </div>
          </div>

          <div className="dash-report-card">
            <h3>📦 Orders by Status</h3>
            {report.salesByStatus?.map(s => (
              <div key={s.status} className="dash-report-row">
                <span><span className="dash-badge" style={{ background: (STATUS_COLOR[s.status] || '#6b7280') + '20', color: STATUS_COLOR[s.status] || '#6b7280' }}>{s.status}</span></span>
                <strong>{s.count} · ₹{parseFloat(s.revenue).toFixed(0)}</strong>
              </div>
            ))}
          </div>

          <div className="dash-report-card">
            <h3>🏆 Top Products</h3>
            {report.topProducts?.map((p, i) => (
              <div key={i} className="dash-report-row">
                <span>#{i + 1} {p.product}</span>
                <strong>{p.qty_sold} sold</strong>
              </div>
            ))}
          </div>

          <div className="dash-report-card full-width">
            <h3>📅 Monthly Revenue</h3>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead><tr><th>Month</th><th>Orders</th><th>Revenue</th></tr></thead>
                <tbody>
                  {report.monthlySales?.map(m => (
                    <tr key={m.month}><td>{m.month}</td><td>{m.orders}</td><td>₹{parseFloat(m.revenue).toFixed(0)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {report.dailySales?.length > 0 && (
            <div className="dash-report-card full-width">
              <h3>📈 Daily Sales</h3>
              <div className="dash-bar-chart">
                {report.dailySales.map((d, i) => {
                  const max = Math.max(...report.dailySales.map(x => parseFloat(x.revenue)));
                  const pct = max > 0 ? (parseFloat(d.revenue) / max) * 100 : 0;
                  return (
                    <div key={i} className="dash-bar-col">
                      <div className="dash-bar-value">₹{parseFloat(d.revenue).toFixed(0)}</div>
                      <div className="dash-bar" style={{ height: `${Math.max(pct, 4)}%` }} />
                      <div className="dash-bar-label">{new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
