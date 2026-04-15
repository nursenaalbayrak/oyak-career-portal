'use client';

import { useFileUpload } from "../hooks/useFileUpload";
import { useState, useMemo } from "react";
import { submitToPowerAutomate, parseCVWithAI } from "../api/submitApplication";
import Image from "next/image";

export default function ApplicationForm() {
  const { fileData, handleFileChange } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false); 
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [modalStatus, setModalStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    ad: '', soyad: '', email: '', telefon: '', pozisyon: 'Genel Başvuru',
  });

  // CV seçildiğinde çalışacak fonksiyon
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileChange(file);
    setIsParsing(true);
    try {
      const result = await parseCVWithAI(file);
      setFormData(prev => ({ 
        ...prev, 
        ad: result.ad || '', 
        soyad: result.soyad || '', 
        email: result.email || '', 
        telefon: result.telefon || ''
      }));
    } catch (err) { 
      console.error("AI okuma hatası:", err); 
    } finally { 
      setIsParsing(false); 
    }
  };

  // Formun geçerli olup olmadığını kontrol eden kural
  const isFormValid = useMemo(() => {
    return !!(formData.ad && formData.soyad && formData.email.includes('@') && fileData && kvkkAccepted);
  }, [formData, fileData, kvkkAccepted]);

  // Formu gönderen asıl fonksiyon
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    const payload = {
      fullName: `${formData.ad} ${formData.soyad}`,
      email: formData.email,
      position: formData.pozisyon,
      cvBase64: fileData?.base64 || "",
      fileName: fileData?.name || "cv.pdf",
      appliedAt: new Date().toISOString()
    };
    
    try {
      await submitToPowerAutomate(payload); 
      setModalStatus('success');
    } catch (err) {
      console.error("Gönderim hatası:", err);
      setModalStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1B] font-sans antialiased">
      
      {/* ÜST NAVİGASYON */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Image src="/oyak-logo-main.png" alt="OYAK ÇİMENTO" width={180} height={45} priority />
          
          <nav className="hidden lg:flex items-center gap-10">
            {['KURUMSAL', 'SÜRDÜRÜLEBİLİRLİK', 'KARİYER', 'BAŞVURU SÜRECİ', 'İLETİŞİM'].map((item) => (
              <span key={item} className={`text-[12px] font-bold tracking-widest cursor-pointer hover:text-[#E30613] transition-colors ${item === 'KARİYER' ? 'text-[#E30613] border-b-2 border-[#E30613] pb-1' : 'text-gray-500'}`}>
                {item}
              </span>
            ))}
          </nav>

          <button className="bg-[#1D1D1B] text-white px-5 py-2 text-[11px] font-bold tracking-tighter hover:bg-[#E30613] transition-all">
            OYAK GRUBU
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#fcfcfc] border-b border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D1D1B] leading-tight mb-6">
            Yarının Dünyasını <span className="text-[#E30613]">Birlikte İnşa Edelim.</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Türkiye'nin endüstriyel gücü OYAK Çimento'da kariyer yolculuğunuza başlayın. 
            Dijital dönüşüm odaklı başvuru sürecimizle yeteneklerinizi geleceğe taşıyoruz.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* SOL TARAF: SÜREÇ BİLGİLERİ */}
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32">
            <h3 className="text-[#E30613] font-bold text-sm tracking-[0.2em] mb-4">BAŞVURU ADIMLARI</h3>
            <div className="space-y-8">
              {[
                { n: '01', t: 'Dijital Profil Oluşturma', d: 'Özgeçmişinizi yükleyerek bilgilerinizi otomatik aktarın.' },
                { n: '02', t: 'Ön Değerlendirme', d: 'Yapay zeka ve İK ekiplerimiz tarafından yapılan teknik inceleme.' },
                { n: '03', t: 'Mülakat Süreçleri', d: 'Yetkinlik bazlı ve teknik görüşmelerin gerçekleştirilmesi.' }
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="text-gray-200 text-3xl font-black">{step.n}</span>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{step.t}</h4>
                    <p className="text-gray-400 text-xs mt-1">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ TARAF: ANA BAŞVURU FORMU */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 shadow-2xl p-8 md:p-12 relative">
            
            <div className="bg-[#1D1D1B] p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <h2 className="text-white font-bold text-xl uppercase tracking-tight">Hızlı Başvuru</h2>
                  <p className="text-gray-400 text-[11px] mt-1">Özgeçmişinizi yükleyin, formunuzu saniyeler içinde dolduralım.</p>
               </div>
               <div className="relative inline-block">
                <input type="file" accept=".pdf" onChange={onFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <button className={`px-8 py-3 font-bold text-[11px] tracking-widest transition-all ${isParsing ? 'bg-gray-700 text-white' : 'bg-[#E30613] text-white hover:bg-white hover:text-[#1D1D1B]'}`}>
                  {isParsing ? 'İŞLENİYOR...' : 'CV İLE OTOMATİK DOLDUR'}
                </button>
               </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 flex flex-col border-b border-gray-200 focus-within:border-[#E30613] transition-all py-3">
                  <label className="text-[10px] font-bold text-[#E30613] uppercase tracking-widest">Başvurulan Pozisyon</label>
                  <select 
                    value={formData.pozisyon}
                    onChange={(e) => setFormData({...formData, pozisyon: e.target.value})}
                    className="bg-transparent py-2 outline-none font-bold text-gray-900 text-lg cursor-pointer appearance-none"
                  >
                    <option value="Genel Başvuru">Genel Başvuru (Aday Havuzu)</option>
                    <option value="Üretim">Üretim / Mühendislik</option>
                    <option value="Bilgi İşlem">Bilgi Teknolojileri</option>
                  </select>
                </div>

                {[
                  { id: 'ad', label: 'AD' }, { id: 'soyad', label: 'SOYAD' },
                  { id: 'email', label: 'E-POSTA ADRESİ' }, { id: 'telefon', label: 'İLETİŞİM NUMARASI' },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col border-b border-gray-200 focus-within:border-[#E30613] transition-all py-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</label>
                    <input 
                      type="text" 
                      value={formData[f.id as keyof typeof formData]}
                      onChange={(e) => setFormData({...formData, [f.id]: e.target.value})}
                      className="bg-transparent py-2 outline-none text-base font-semibold text-gray-900 placeholder-gray-200"
                      placeholder="Girilmedi"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-10 space-y-8">
                <div className="flex items-start gap-4 cursor-pointer group" onClick={() => setKvkkAccepted(!kvkkAccepted)}>
                  <div className={`w-5 h-5 border-2 transition-all flex-shrink-0 ${kvkkAccepted ? 'bg-[#E30613] border-[#E30613]' : 'border-gray-300 group-hover:border-[#E30613]'}`}>
                    {kvkkAccepted && <svg className="text-white w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4"/></svg>}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca hazırlanan <span className="underline text-[#1D1D1B] cursor-help">Aydınlatma Metni</span>'ni okudum ve kabul ediyorum.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-5 font-bold text-xs tracking-[0.4em] transition-all shadow-xl ${
                    isFormValid && !isSubmitting 
                      ? 'bg-[#E30613] text-white hover:bg-[#1D1D1B] cursor-pointer active:scale-[0.98]' 
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'BAŞVURU İLETİLİYOR...' : 'BAŞVURUYU TAMAMLA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-[#1D1D1B] text-white py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-12">
           <div>
              <Image src="/oyak-logo-main.png" alt="OYAK" width={120} height={30} className="brightness-0 invert mb-6" />
              <p className="text-gray-400 text-xs leading-relaxed">Türkiye'nin her noktasında, geleceği inşa eden projelerin güvenilir çözüm ortağıyız.</p>
           </div>
           <div className="space-y-2">
              <h5 className="font-bold text-xs tracking-widest text-[#E30613]">HIZLI ERİŞİM</h5>
              <ul className="text-gray-400 text-xs space-y-2">
                <li>Bilgi Toplumu Hizmetleri</li>
                <li>Hisse Takibi</li>
                <li>İnsan Kaynakları Politikası</li>
              </ul>
           </div>
           <div className="space-y-2">
              <h5 className="font-bold text-xs tracking-widest text-[#E30613]">İLETİŞİM</h5>
              <p className="text-gray-400 text-xs">Genel Müdürlük: Çankaya/Ankara</p>
              <p className="text-gray-400 text-xs">E-Posta: kariyer@oyakcimento.com</p>
           </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-8 text-center text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} OYAK ÇİMENTO A.Ş. • TÜM HAKLARI SAKLIDIR
        </div>
      </footer>

      {/* Başarı/Hata Modalı */}
      {modalStatus !== 'idle' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white p-10 max-w-md w-full text-center shadow-2xl border-t-4 border-[#E30613]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {modalStatus === 'success' ? 'Başvurunuz Alındı' : 'Bir Hata Oluştu'}
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              {modalStatus === 'success' 
                ? 'Bilgileriniz başarıyla sisteme kaydedildi. En kısa sürede sizinle iletişime geçilecektir.' 
                : 'Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.'}
            </p>
            <button 
              onClick={() => modalStatus === 'success' ? window.location.reload() : setModalStatus('idle')}
              className="w-full py-4 bg-[#1D1D1B] text-white font-bold text-xs tracking-widest hover:bg-[#E30613] transition-all"
            >
              KAPAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}