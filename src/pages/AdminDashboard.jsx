import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Data Mockup untuk Admin
const initialReservations = [
  { id: 'INV-50173', name: 'Ardianto', mess: 'Tenera', qty: 1, durasi: 2, status: 'Menunggu Pembayaran', total: 'Rp 0', phone: '08123456789' },
  { id: 'INV-12345', name: 'Budi Santoso', mess: 'Prana', qty: 2, durasi: 1, status: 'Dibayar', total: 'Rp 1.600.000', phone: '08567890123' },
  { id: 'INV-98765', name: 'Siti Aminah', mess: 'Oleo I', qty: 1, durasi: 3, status: 'Check-In', total: 'Rp 1.500.000', phone: '08111222333', checkInTime: new Date(Date.now() - 3600000 * 2.5) }, // 2.5 jam lalu
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(initialReservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Modal QR State
  const [showQR, setShowQR] = useState(false);
  const [qrType, setQrType] = useState('checkin'); // 'checkin' | 'checkout'
  const [selectedRes, setSelectedRes] = useState(null);

  // Timer Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const filteredReservations = reservations.filter(res => {
    const matchName = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = activeTab === 'Semua' ? true : res.status === activeTab;
    return matchName && matchStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setReservations(prev => prev.map(res => {
      if (res.id === id) {
        if (newStatus === 'Check-In' && !res.checkInTime) {
          return { ...res, status: newStatus, checkInTime: new Date() };
        }
        return { ...res, status: newStatus };
      }
      return res;
    }));
  };

  const getDuration = (checkInTime) => {
    if (!checkInTime) return '-';
    const diff = currentTime - checkInTime;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openQRModal = (res, type) => {
    setSelectedRes(res);
    setQrType(type);
    setShowQR(true);
  };

  const simulateQRScan = () => {
    if (qrType === 'checkin') {
      handleStatusChange(selectedRes.id, 'Check-In');
    } else {
      handleStatusChange(selectedRes.id, 'Selesai');
    }
    setShowQR(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a6b3e] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center justify-center border-b border-white/10 bg-[#085a34]">
          <img src="/assets/logo/LOGO-REGIONAL-PTPN4.png" alt="PTPN IV" className="h-10 w-auto brightness-0 invert" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center px-4 py-3 bg-white/10 rounded-xl font-medium text-sm transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center px-4 py-3 text-emerald-100 hover:bg-white/5 rounded-xl font-medium text-sm transition">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            Buka Halaman Publik
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl font-bold text-sm transition border border-white/20">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Manajemen Reservasi Mess</h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm border border-emerald-200">A</div>
            <span className="text-sm font-semibold text-gray-600 hidden md:block">Admin Pusat</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Reservasi</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{reservations.length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tamu Check-In</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{reservations.filter(r => r.status === 'Check-In').length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Menunggu Bayar</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{reservations.filter(r => r.status === 'Menunggu Pembayaran').length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Dibayar / Proses</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{reservations.filter(r => r.status === 'Dibayar').length}</h3>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                {['Semua', 'Menunggu Pembayaran', 'Dibayar', 'Check-In', 'Selesai'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Cari nama pemesan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full md:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4 border-b border-gray-200">ID Invoice</th>
                    <th className="p-4 border-b border-gray-200">Nama Pemesan</th>
                    <th className="p-4 border-b border-gray-200">Mess</th>
                    <th className="p-4 border-b border-gray-200">Status</th>
                    <th className="p-4 border-b border-gray-200">Timer Menginap</th>
                    <th className="p-4 border-b border-gray-200 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Tidak ada data ditemukan.</td>
                    </tr>
                  ) : filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-sm text-gray-900">{res.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{res.name}</div>
                        <div className="text-xs text-gray-500">{res.phone}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <b>{res.mess}</b> ({res.qty} Kmr, {res.durasi} Mlm)
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          res.status === 'Selesai' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          res.status === 'Check-In' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          res.status === 'Dibayar' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {res.status === 'Check-In' ? (
                          <div className="flex items-center text-blue-600 font-mono font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100 inline-flex">
                            <svg className="w-4 h-4 mr-1.5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {getDuration(res.checkInTime)}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {res.status === 'Menunggu Pembayaran' && (
                          <button onClick={() => handleStatusChange(res.id, 'Dibayar')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition">Tandai Lunas</button>
                        )}
                        {res.status === 'Dibayar' && (
                          <button onClick={() => openQRModal(res, 'checkin')} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center ml-auto">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            QR Check-In
                          </button>
                        )}
                        {res.status === 'Check-In' && (
                          <button onClick={() => openQRModal(res, 'checkout')} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center ml-auto">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            QR Check-Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* QR Modal (SIMULASI) */}
      {showQR && selectedRes && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowQR(false)}></div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl relative w-full max-w-sm text-center animate-[popIn_0.3s_ease-out]">
            <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className={`text-xl font-extrabold mb-1 ${qrType === 'checkin' ? 'text-blue-600' : 'text-rose-600'}`}>
              QR {qrType === 'checkin' ? 'Check-In' : 'Check-Out'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">Tunjukkan QR ini kepada tamu untuk dipindai.</p>
            
            <div className="w-56 h-56 mx-auto bg-gray-50 border-4 border-gray-100 rounded-2xl flex flex-col items-center justify-center mb-6 overflow-hidden relative group p-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SimulasiCheckin" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-left">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Data Tamu</p>
              <p className="font-bold text-gray-900 text-lg">{selectedRes.name}</p>
              <p className="text-sm text-gray-600">Mess {selectedRes.mess} • {selectedRes.qty} Kamar</p>
            </div>

            <button onClick={simulateQRScan} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center ${qrType === 'checkin' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'}`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              [Simulasi] Tamu Berhasil Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
