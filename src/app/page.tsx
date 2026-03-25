'use client';

import { useFileUpload } from "../hooks/useFileUpload";
import { OYAK_THEME } from "../constants/theme";
import { useState, useMemo } from "react";
import { submitToPowerAutomate } from "../api/submitApplication";

export default function ApplicationForm() {
  const { fileData, error: fileError, handleFileChange } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  
  // 1. MODAL DURUMU: Başlangıçta 'idle' (görünmez)
  const [modalStatus, setModalStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    pozisyon: 'Genel Başvuru',
  });

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);

  const isPhoneValid = useMemo(() => {
    return formData.telefon.replace(/\D/g, '').length >= 10;
  }, [formData.telefon]);

  const isFormValid = formData.ad && formData.soyad && isEmailValid && isPhoneValid && fileData && kvkkAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    const payload = {
      fullName: `${formData.ad} ${formData.soyad}`,
      email: formData.email,
      position: formData.pozisyon,
      cvBase64: fileData.base64,
      fileName: fileData.name,
      appliedAt: new Date().toISOString()
    };
    
    try {
      await submitToPowerAutomate(payload); 
      // 2. BAŞARILI: alert yerine modalı açıyoruz
      setModalStatus('success');
    } catch (err) {
      // 3. HATA: alert yerine hata modalını açıyoruz
      setModalStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-10" style={{ fontFamily: OYAK_THEME.fonts.main }}>
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100 relative">
        
        <div className="bg-[#E30613] p-5 text-center shadow-md">
          <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tighter">
            OYAK ÇİMENTO KARİYER PORTALI
          </h1>
        </div>

        <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            
            {/* Pozisyon Seçimi */}
            <div className="md:col-span-2 mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded shadow-inner">
              <label className="text-xs font-bold uppercase text-blue-900 mb-2 block">Başvuru Pozisyonu</label>
              <select 
                value={formData.pozisyon}
                onChange={(e) => setFormData({...formData, pozisyon: e.target.value})}
                className="w-full md:w-1/2 p-2.5 text-sm border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="Genel Başvuru">Genel Başvuru (Havuz)</option>
                <option value="Yazılım Geliştirici">Yazılım Geliştirici</option>
                <option value="Üretim Mühendisi">Üretim Mühendisi</option>
              </select>
            </div>

            {/* Ad */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-600 mb-1.5">ADINIZ</label>
              <input 
                type="text" required
                value={formData.ad}
                onChange={(e) => setFormData({...formData, ad: e.target.value})}
                className="px-4 py-2.5 text-sm border border-gray-300 rounded focus:border-red-500 outline-none bg-gray-50" 
              />
            </div>
            
            {/* Soyad */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-600 mb-1.5">SOYADINIZ</label>
              <input 
                type="text" required
                value={formData.soyad}
                onChange={(e) => setFormData({...formData, soyad: e.target.value})}
                className="px-4 py-2.5 text-sm border border-gray-300 rounded focus:border-red-500 outline-none bg-gray-50" 
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-600 mb-1.5">E-POSTA</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`px-4 py-2.5 text-sm border rounded outline-none transition ${formData.email && !isEmailValid ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} 
              />
              {formData.email && !isEmailValid && <span className="text-[10px] text-red-600 mt-1">Geçerli bir e-posta adresi giriniz.</span>}
            </div>

            {/* Telefon */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-gray-600 mb-1.5">TELEFON</label>
              <input 
                type="tel" required
                value={formData.telefon}
                onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                placeholder="05xxxxxxxxx"
                className={`px-4 py-2.5 text-sm border rounded outline-none transition ${formData.telefon && !isPhoneValid ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} 
              />
              {formData.telefon && !isPhoneValid && <span className="text-[10px] text-red-600 mt-1">Telefon numarası en az 10 hane olmalıdır.</span>}
            </div>

            {/* CV Yükleme */}
            <div className="md:col-span-2 mt-2 border-2 border-dashed border-gray-300 p-6 text-center rounded-xl bg-gray-50">
               <input 
                type="file" accept=".pdf"
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                className="text-xs text-gray-500" 
               />
               {fileData && <p className="text-xs text-green-700 font-bold mt-2">✓ {fileData.name} hazır.</p>}
               {fileError && <p className="text-xs text-red-700 font-bold mt-2">⚠️ {fileError}</p>}
            </div>

            {/* KVKK Checkbox */}
            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-gray-50 rounded border border-gray-200">
              <input 
                type="checkbox" id="kvkk"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
              />
              <label htmlFor="kvkk" className="text-[11px] text-gray-600 leading-tight cursor-pointer">
                <strong className="text-gray-800">KVKK Aydınlatma Metni:</strong> Kişisel verilerimin Oyak Çimento Kariyer Portal başvurusu kapsamında işlenmesini, saklanmasını ve gerektiğinde iletişime geçilmesini kabul ediyorum.
              </label>
            </div>

            {/* Gönder Butonu */}
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 text-white text-sm font-bold rounded uppercase tracking-widest transition-all ${isFormValid && !isSubmitting ? 'bg-[#E30613] hover:bg-black shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isSubmitting ? 'İŞLENİYOR...' : 'BAŞVURUYU TAMAMLA'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4. MODAL BİLEŞENİ: Buraya ekledik! */}
      {modalStatus !== 'idle' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all animate-in zoom-in duration-300">
            {modalStatus === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Başvurunuz Alındı!</h3>
                <p className="text-gray-600 mb-6 text-sm">Özgeçmişiniz başarıyla iletildi. Onay mailinizi kontrol etmeyi unutmayın.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-[#E30613] text-white rounded-lg font-bold hover:bg-black transition"
                >
                  OK
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h3>
                <p className="text-gray-600 mb-6 text-sm">Şu an başvurunuzu alamıyoruz. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
                <button 
                  onClick={() => setModalStatus('idle')}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition"
                >
                  Tekrar Dene
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}