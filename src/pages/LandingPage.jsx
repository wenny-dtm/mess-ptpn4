import { useState, useEffect } from 'react';

// Data Mess
const messData = [
  { id: 1, name: 'Tenera', location: 'Parapat', kamar: 3, tempatTidur: 5, status: 'Mess Direksi', price: null, pic: 'Abdi Rangkuti', image: '/assets/foto-mess/Mess Tenera.webp', available: true },
  { id: 2, name: 'Horas', location: 'Parapat', kamar: 3, tempatTidur: 6, status: 'Mess Direksi', price: null, pic: 'Rici', image: '/assets/foto-mess/Mess Horas.webp', available: false },
  { id: 3, name: 'Prana', location: 'Parapat', kamar: 5, tempatTidur: 10, status: 'Tarif', price: 800000, pic: 'Dian Kurniaty', image: '/assets/foto-mess/Mess Prana.webp', available: true },
  { id: 4, name: 'Kayu Aro', location: 'Parapat', kamar: 4, tempatTidur: 9, status: 'Tarif', price: 700000, pic: 'Desni', image: '/assets/foto-mess/mess kayu aro.webp', available: true },
  { id: 5, name: 'Oleo I', location: 'Parapat', kamar: 3, tempatTidur: 6, status: 'Tarif', price: 500000, pic: 'Jubesli Sinaga', image: '/assets/foto-mess/Mess Oleo I.webp', available: true },
  { id: 6, name: 'Oleo II', location: 'Parapat', kamar: 4, tempatTidur: 8, status: 'Tarif', price: 500000, pic: 'Jubesli Sinaga', image: '/assets/foto-mess/Mess Oleo II.webp', available: true },
  { id: 7, name: 'Fisifera', location: 'Parapat', kamar: 2, tempatTidur: 5, status: 'Tarif', price: 300000, pic: 'Sahat Simbolon', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop', available: true },
  { id: 8, name: 'Dura', location: 'Berastagi', kamar: 3, tempatTidur: 6, status: 'Mess Direksi', price: null, pic: 'Nurfi', image: '/assets/foto-mess/Mess dura.jpg', available: true },
  { id: 9, name: 'Capricornus', location: 'Berastagi', kamar: 3, tempatTidur: 6, status: 'Tarif', price: 500000, pic: 'Iwan', image: '/assets/foto-mess/mess capricon.jpg', available: false }
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedMess, setSelectedMess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [priceUnblurred, setPriceUnblurred] = useState(false);
  const [formType, setFormType] = useState('karyawan');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [receiptData, setReceiptData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (showModal || showReceipt) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [showModal, showReceipt]);

  const filters = ['Semua', 'Parapat', 'Berastagi'];
  const filteredData = activeFilter === 'Semua' ? messData : messData.filter(m => m.location === activeFilter);

  const handleOpenModal = (mess) => {
    setSelectedMess(mess);
    setCurrentImage(mess.image);
    setPriceUnblurred(false);
    setFormType('karyawan');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMess?.available) return;

    let name = '';
    let hp = '';
    let email = e.target['f-email'].value;
    let qty = parseInt(e.target['f-qty'].value) || 1;
    let durasi = parseInt(e.target['f-durasi'].value) || 1;
    
    if (formType === 'karyawan') {
      name = e.target['f-niksap'].value + ' - ' + e.target['f-jabatan'].value;
      hp = e.target['f-hp'].value;
    } else {
      name = e.target['f-nama'].value;
      hp = e.target['f-hp'].value;
    }

    let totalHarga = selectedMess.price ? selectedMess.price * qty * durasi : 0;

    setShowModal(false);
    setReceiptData({
      id: 'INV-' + Math.floor(10000 + Math.random() * 90000),
      name,
      hp,
      email,
      qty,
      durasi,
      type: formType === 'karyawan' ? 'Karyawan PTPN' : 'Masyarakat Umum',
      mess: selectedMess.name,
      payment: paymentMethod,
      priceRaw: selectedMess.price,
      total: selectedMess.price ? formatRupiah(totalHarga) : 'Rp 0'
    });
    setShowReceipt(true);
  };

  return (
    <div className="text-gray-800 antialiased overflow-x-hidden min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-[#0a6b3e]/75 backdrop-blur-lg z-40 border-b border-white/10 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-10 md:h-12 w-auto brightness-0 invert" src="/assets/logo/LOGO-REGIONAL-PTPN4.png" alt="PTPN IV" />
            </div>
            <div>
              <button onClick={() => document.getElementById('mess-grid').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-[#0a6b3e] hover:bg-gray-100 hover:shadow-lg px-5 py-2.5 rounded-full text-sm font-bold transition duration-300 hidden md:block">
                Booking Now
              </button>
              <button className="md:hidden text-white hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-screen overflow-hidden">
        {/* Background Image */}
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop" alt="Mess View" className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/65 backdrop-blur-sm"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block border border-white/30">Fasilitas Akomodasi PTPN IV</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-xl">
            Kenyamanan Eksklusif di <span className="text-emerald-400 block md:inline">Mess Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
            Pesan mess untuk keperluan dinas maupun rekreasi pribadi dengan layanan terbaik, fasilitas lengkap, dan lokasi yang strategis.
          </p>
        </div>
      </div>

      {/* Main Content: Filter & Grid */}
      <div id="mess-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-24">
        
        {/* Filter Tabs */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-12 overflow-x-auto hide-scrollbar py-2">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)} 
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition duration-300 border whitespace-nowrap ${f === activeFilter ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        {/* Mess Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredData.map(mess => {
            const badgeColor = mess.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200';
            const badgeText = mess.available ? 'Tersedia' : 'Penuh';
            const priceText = mess.price ? formatRupiah(mess.price) : 'Mess Direksi';

            return (
              <div key={mess.id} className="bg-white rounded-[1.5rem] smooth-shadow border border-gray-100/50 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col" onClick={() => handleOpenModal(mess)}>
                <div className="relative overflow-hidden">
                  <img src={mess.image} className="h-60 w-full object-cover group-hover:scale-105 transition duration-700 ease-out" alt={mess.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className={`absolute top-4 right-4 ${badgeColor} border px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center backdrop-blur-md`}>
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {mess.available 
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path> 
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>}
                    </svg>
                    {badgeText}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition">{mess.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1.5 font-medium">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {mess.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-5 mb-8 text-sm text-gray-600 font-medium">
                    <div className="flex items-center bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-100 w-full justify-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      {mess.kamar} Kamar
                    </div>
                    <div className="flex items-center bg-gray-50 px-3.5 py-2 rounded-lg border border-gray-100 w-full justify-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                      {mess.tempatTidur} T.Tidur
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tarif Menginap</p>
                      {mess.price ? (
                        <p className="text-xl font-extrabold text-gray-900 blur-[6px] select-none">{priceText}</p>
                      ) : (
                        <p className="text-lg font-extrabold text-primary">{mess.status}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#053d22] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
            
            {/* Kolom 1: Alamat & Info */}
            <div className="text-center md:text-left space-y-4">
              <img src="/assets/logo/LOGO-REGIONAL-PTPN4.png" className="h-12 w-auto mx-auto md:mx-0 brightness-0 invert opacity-90" alt="PTPN IV" />
              <h4 className="text-xl font-bold tracking-wide mt-4">PT Perkebunan Nusantara IV</h4>
              <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                Jl. Letjend. Suprapto No.2, Jati, Kec. Medan Maimun<br/>
                Kota Medan, Sumatera Utara 20151<br/>
                Telp: (061) 4154666
              </p>
            </div>

            {/* Kolom 2: Logo Dukungan */}
            <div className="flex flex-col items-center md:items-end">
              <h5 className="text-xs font-bold text-white-300 uppercase tracking-[0.2em] mb-6">Didukung Oleh</h5>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 md:gap-10 opacity-90 hover:opacity-100 transition duration-500">
                <img src="/assets/logo/LOGO-DANANTARA.png" className="h-10 md:h-14 w-auto object-contain" alt="Danantara" />
                <img src="/assets/logo/LOGO-PTPN.png" className="h-10 md:h-14 w-auto object-contain" alt="Holding Perkebunan" />
              </div>
            </div>

          </div>

          {/* Copyright Area */}
          <div className="mt-16 pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-100/50 text-sm font-medium">&copy; 2026 Putra Fialdy</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-emerald-100/50">
              <a href="#" className="hover:text-emerald-300 transition">Kebijakan Privasi</a>
              <a href="#" className="hover:text-emerald-300 transition">Syarat & Ketentuan</a>
              <span className="hidden sm:block text-emerald-800">|</span>
              <span className="text-emerald-100/40">Dikembangkan oleh <span className="text-emerald-300/80 font-semibold">Putra Fialdy</span></span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: Detail & Booking */}
      {showModal && selectedMess && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
          
          <div className="absolute inset-0 flex items-start md:items-center justify-center p-0 md:p-6 lg:p-8 pointer-events-none">
            <div className="bg-white md:rounded-[2rem] w-full max-h-screen md:h-auto md:max-h-[90vh] md:max-w-6xl flex flex-col md:flex-row relative pointer-events-auto shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-y-auto md:overflow-hidden">
              
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 backdrop-blur p-2.5 rounded-full text-gray-600 hover:text-gray-900 shadow-md hover:shadow-lg z-20 transition transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <div className="w-full md:w-1/2 p-6 pt-16 md:p-8 lg:p-10 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 md:overflow-y-auto">
                <div className="relative w-full h-56 shrink-0 md:shrink md:h-96 md:rounded-2xl overflow-hidden mb-6 shadow-sm group">
                  <img src={currentImage} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Mess" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="flex space-x-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                  {[selectedMess.image, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=300&auto=format&fit=crop", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop"].map((img, idx) => (
                    <img key={idx} src={img} onClick={() => setCurrentImage(img)} className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 object-cover rounded-xl cursor-pointer transition shadow-sm ${currentImage === img ? 'ring-4 ring-primary opacity-100' : 'opacity-60 hover:opacity-100'}`} alt="Gallery" />
                  ))}
                </div>
                
                <div className="mt-auto md:mb-0">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    Fasilitas Tersedia
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 font-medium">
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> Wi-Fi</span>
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> AC</span>
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> TV LED</span>
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> Water Heater</span>
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> Dapur</span>
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center shadow-sm"> Parkir</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col bg-white md:overflow-y-auto relative">
                <div className="mb-8">
                  <div className="flex items-center text-sm text-primary font-bold tracking-widest uppercase mb-2">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {selectedMess.location}
                  </div>
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{selectedMess.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium mb-6">
                    <span className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> {selectedMess.kamar} Kamar</span>
                    <span className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> {selectedMess.tempatTidur} T.Tidur</span>
                    <span className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm"><svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> PIC: {selectedMess.pic}</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 flex items-center justify-between border border-gray-200 shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tarif Menginap per Malam</p>
                      <div className="flex items-center space-x-3">
                        {selectedMess.price ? (
                          <span className={`text-3xl font-extrabold text-gray-900 transition-all duration-300 select-none ${!priceUnblurred ? 'blur-md' : 'blur-none'}`}>
                            {formatRupiah(selectedMess.price)}
                          </span>
                        ) : (
                          <span className="text-2xl font-bold text-primary">{selectedMess.status}</span>
                        )}
                      </div>
                    </div>
                    {selectedMess.price && (
                      <button type="button" onClick={() => setPriceUnblurred(!priceUnblurred)} className="text-sm bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-900 transition shadow-sm flex items-center">
                        {!priceUnblurred ? (
                          <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>Lihat Harga</>
                        ) : (
                          <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>Sembunyikan</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-5">Informasi Pemesan</h3>
                  
                  <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
                    <button type="button" onClick={() => setFormType('karyawan')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${formType === 'karyawan' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Karyawan PTPN</button>
                    <button type="button" onClick={() => setFormType('umum')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${formType === 'umum' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>Masyarakat Umum</button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="space-y-4 mb-8">
                      {formType === 'karyawan' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">NIKSAP</label>
                              <input type="text" id="f-niksap" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Masukkan NIKSAP" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Jabatan</label>
                              <input type="text" id="f-jabatan" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Contoh: Manager / Staf" />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                              <input type="email" id="f-email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Email aktif" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">No. HP (WhatsApp)</label>
                              <input type="tel" id="f-hp" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="08xxxxxxxxxx" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">NIK KTP</label>
                            <input type="text" id="f-nik" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Masukkan NIK 16 digit" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                            <input type="text" id="f-nama" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Sesuai KTP" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                              <input type="email" id="f-email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="Email aktif" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">No. HP (WhatsApp)</label>
                              <input type="tel" id="f-hp" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" placeholder="08xxxxxxxxxx" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 border-t border-gray-100 pt-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Jumlah Kamar</label>
                        <input type="number" id="f-qty" min="1" max={selectedMess.kamar} defaultValue="1" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Lama Menginap (Malam)</label>
                        <input type="number" id="f-durasi" min="1" defaultValue="1" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-10">
                      <label className="text-sm font-bold text-gray-900">Metode Pembayaran</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="border border-gray-200 rounded-xl p-4 flex items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition group bg-white">
                          <input type="radio" name="payment" value="Transfer Bank" checked={paymentMethod === 'Transfer Bank'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary focus:ring-primary w-5 h-5 accent-primary" />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-primary font-semibold">Transfer Bank</span>
                        </label>
                        <label className="border border-gray-200 rounded-xl p-4 flex items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition group bg-white">
                          <input type="radio" name="payment" value="E-Wallet (QRIS)" checked={paymentMethod === 'E-Wallet (QRIS)'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary focus:ring-primary w-5 h-5 accent-primary" />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-primary font-semibold">E-Wallet (QRIS)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-gray-100 pb-4">
                      <a href={`https://wa.me/628000000000?text=${encodeURIComponent('Halo Bapak/Ibu ' + selectedMess.pic + ', saya ingin memperpanjang/menanyakan sewa Mess ' + selectedMess.name + '.')}`} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center transition">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        Hubungi PIC
                      </a>
                      <button type="submit" disabled={!selectedMess.available} className={`flex-1 py-4 rounded-xl font-bold text-base transition flex items-center justify-center ${selectedMess.available ? 'bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/30' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                        {selectedMess.available ? (
                          <>Pesan Sekarang <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></>
                        ) : 'Kamar Penuh'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Digital Receipt */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-[60] print:relative">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity print:hidden" onClick={() => setShowReceipt(false)}></div>
          
          <div className="absolute inset-0 overflow-y-auto print:overflow-visible flex flex-col items-center p-4 md:py-10">
            <div className="bg-[#f4f6f8] print:bg-white w-full max-w-4xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl print:shadow-none relative animate-[popIn_0.4s_ease-out]">
              
              <div className="absolute top-4 right-4 flex space-x-2 print:hidden z-10">
                 <button onClick={() => window.print()} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-primary transition flex items-center font-bold text-sm">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak
                 </button>
                 <button onClick={() => setShowReceipt(false)} className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-red-500 transition">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>

              <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] print:shadow-none border border-gray-100 print:border-none mt-14 sm:mt-12 md:mt-0">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-gray-200 pb-6 mb-6 gap-6 md:gap-0">
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                    <img src="/assets/logo/LOGO-DANANTARA.png" className="h-7 sm:h-8 md:h-12 w-auto object-contain grayscale" alt="Danantara" />
                    <img src="/assets/logo/LOGO-PTPN.png" className="h-7 sm:h-8 md:h-12 w-auto object-contain grayscale" alt="PTPN" />
                    <img src="/assets/logo/LOGO-REGIONAL-PTPN4.png" className="h-7 sm:h-8 md:h-12 w-auto object-contain grayscale" alt="PTPN IV" />
                  </div>
                  <div className="text-center md:text-right text-[12px] md:text-[13px] text-gray-800 leading-tight">
                    <b className="text-[13px] md:text-sm">PT PERKEBUNAN NUSANTARA IV</b><br/>
                    Jl. Letjend. Suprapto No.2, Medan<br/>
                    Telp: (061) 4154666
                  </div>
                </div>

                {/* TITLE */}
                <div className="text-center my-8 text-[26px] font-bold text-[#0a6b3e] tracking-[2px]">
                  INVOICE PEMESANAN
                </div>

                {/* INFO */}
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                  <div className="w-full md:w-[48%] text-[14px] text-gray-800 space-y-2.5">
                    <div><b>Nama Pemesan :</b> {receiptData.name}</div>
                    <div><b>Email :</b> {receiptData.email}</div>
                    <div><b>No HP :</b> {receiptData.hp}</div>
                    <div><b>Tujuan :</b> Mess {receiptData.mess}</div>
                  </div>

                  <div className="w-full md:w-[48%] text-[14px] text-gray-800 space-y-2.5">
                    <div><b>No Invoice :</b> {receiptData.id}</div>
                    <div><b>Tanggal :</b> {new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</div>

                    <div className="border border-gray-300 p-4 rounded-lg text-center mt-4 bg-white shadow-sm">
                      <b className="text-gray-700 block mb-1">Status Pemesanan</b>
                      <h3 className="m-0 text-orange-500 font-bold text-lg">Pemesanan Akan Diproses</h3>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">Pesanan Anda sedang diproses oleh tim kami.</p>
                    </div>
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto mt-6">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold w-12 text-center">No</th>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold text-left">Deskripsi</th>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold w-16 text-center">Qty</th>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold w-24 text-center">Satuan</th>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold w-36 text-right">Harga</th>
                        <th className="bg-[#0a6b3e] text-white p-3 text-[14px] border border-gray-300 font-semibold w-36 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 text-[14px] text-center">1</td>
                        <td className="border border-gray-300 p-3 text-[14px] font-medium">Sewa Mess {receiptData.mess} ({receiptData.durasi} Malam)</td>
                        <td className="border border-gray-300 p-3 text-[14px] text-center">{receiptData.qty}</td>
                        <td className="border border-gray-300 p-3 text-[14px] text-center">Kamar</td>
                        <td className="border border-gray-300 p-3 text-[14px] text-right">{receiptData.priceRaw ? formatRupiah(receiptData.priceRaw * receiptData.durasi) : '-'}</td>
                        <td className="border border-gray-300 p-3 text-[14px] text-right font-semibold">{receiptData.total}</td>
                      </tr>
                      <tr>
                        <td colSpan="5" className="border border-gray-300 p-3 text-[14px] text-right font-bold tracking-wide">TOTAL</td>
                        <td className="border border-gray-300 p-3 text-[14px] text-right font-bold bg-gray-50 text-emerald-700">{receiptData.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* FOOTER & INSTRUCTIONS */}
                <div className="mt-6 text-[14px] text-gray-800 leading-relaxed">
                  <b>Terbilang :</b> <i className="text-gray-600">{receiptData.priceRaw ? '(Sesuai Nominal Tarif)' : 'Nol Rupiah'}</i><br/>
                  <b>Keterangan :</b> Pemesanan akan diproses sesuai dengan ketentuan reservasi Mess PTPN IV.
                </div>

                {receiptData.priceRaw > 0 && receiptData.payment === 'Transfer Bank' && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-start print:border-gray-300 print:bg-white print:border-2">
                    <svg className="w-6 h-6 text-blue-500 print:text-gray-700 mr-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 print:text-gray-900 mb-2">Instruksi Pembayaran</h4>
                      <p className="text-[13px] text-blue-800 print:text-gray-700 leading-relaxed">
                        Silakan lakukan pembayaran senilai <b className="text-lg text-blue-900 print:text-black">{receiptData.total}</b> ke rekening berikut:<br/>
                        Bank Mandiri: <b className="font-mono text-base ml-1">123-456-789-0123</b> a.n PTPN IV<br/>
                        Setelah melakukan transfer, harap konfirmasi bukti transfer melalui WhatsApp PIC Mess.
                      </p>
                    </div>
                  </div>
                )}

                {receiptData.priceRaw > 0 && receiptData.payment === 'E-Wallet (QRIS)' && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-start print:border-gray-300 print:bg-white print:border-2">
                    <svg className="w-6 h-6 text-blue-500 print:text-gray-700 mr-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 print:text-gray-900 mb-2">Instruksi Pembayaran QRIS</h4>
                      <p className="text-[13px] text-blue-800 print:text-gray-700 leading-relaxed">
                        Silakan pindai kode QRIS di meja resepsionis saat kedatangan, atau hubungi PIC Mess untuk meminta kode QRIS.<br/>
                        Total tagihan: <b className="text-lg text-blue-900 print:text-black">{receiptData.total}</b>
                      </p>
                    </div>
                  </div>
                )}

                {/* SIGN */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-12 text-[14px] text-gray-800 gap-8 md:gap-0 print:flex-row print:gap-0">
                  <div className="text-center w-full md:w-[30%] print:w-[30%]">
                    <p className="mb-16">Pemesan</p>
                    <p><b>({receiptData.name})</b></p>
                  </div>
                  <div className="text-center w-full md:w-[30%] print:w-[30%]">
                    <p className="mb-16">Admin / Kasir</p>
                    <p><b>(...................................)</b></p>
                  </div>
                  <div className="text-center w-full md:w-[30%] print:w-[30%]">
                    <p className="mb-16">Mengetahui, PIC Mess</p>
                    <p><b>({selectedMess.pic})</b></p>
                  </div>
                </div>

                {/* NOTE */}
                <div className="mt-8 text-[12px] bg-[#eef5f1] border border-[#d2e8db] p-4 rounded-lg text-gray-700 leading-relaxed print:bg-white print:border-gray-300">
                  <ul className="list-disc pl-4 m-0 space-y-1">
                    <li>Invoice ini merupakan bukti reservasi yang sah.</li>
                    <li>Pesanan Anda akan berstatus <b>Dikonfirmasi</b> setelah melakukan pembayaran.</li>
                    <li>Silakan hubungi admin / PIC Mess untuk bantuan lebih lanjut.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
