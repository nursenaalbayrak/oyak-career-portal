# Oyak Çimento Kariyer Portalı

Bu proje, Oyak Çimento İş Zekası departmanındaki staj sürecim kapsamında, aday başvuru süreçlerini otomatize etmek ve İnsan Kaynakları iş akışını hızlandırmak amacıyla geliştirilmiş uçtan uca  bir dijital çözümdür.

 **Canlı Demo:** [oyak-career-portal.vercel.app](https://oyak-career-portal.vercel.app)

---

##  Sistem Mimarisi ve Akış

Sistem, modern web teknolojileri ile kurumsal otomasyon araçlarının entegrasyonu üzerine kurulmuştur:

1.  **Frontend (Next.js):** Adayların bilgilerini girdiği ve CV'lerini  yüklediği arayüz.
2.  **Otomasyon (Power Automate):** Verileri anlık olarak yakalayan, işleyen ve dağıtan motor.
3.  **Veri Yönetimi (SharePoint):** Tüm başvuruların ve dosyaların güvenli bir şekilde saklandığı veritabanı.
4.  **İletişim (Outlook & Teams):** Adaya otomatik onay/mülakat mailleri gönderimi ve İK ekibine anlık Teams bildirimleri.

---

## ✨ Temel Özellikler

- **Anlık Başvuru Kaydı:** Form doldurulduğu anda SharePoint listesine otomatik veri girişi.
- **Akıllı Dosya Yönetimi:** Yüklenen CV'lerin aday ismiyle klasörlenerek SharePoint'e kaydedilmesi.
- **Dinamik Bilgilendirme:** - Adaya kurumsal tasarımlı "Başvuru Alındı" maili.
- **İK tarafından durum "Mülakat Planlandı" olarak güncellendiğinde interaktif mülakat daveti.
- **İK Bildirim Sistemi:** Yeni bir başvuru geldiğinde İK ekibine Microsoft Teams üzerinden anlık bildirim.

---

##  Kullanılan Teknolojiler

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend/Automation:** Microsoft Power Automate
- **Storage:** Microsoft SharePoint, OneDrive for Business
- **Communication:** Microsoft Outlook, Microsoft Teams
- **Deployment:** Vercel, GitHub

---

---
