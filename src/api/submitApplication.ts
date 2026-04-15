import { CandidateApplication } from "../types/candidate";

// .env.local dosyasındaki URL'leri okuyoruz
const FLOW_URL = process.env.NEXT_PUBLIC_FLOW_URL; 
const CV_PARSE_URL = process.env.NEXT_PUBLIC_CV_PARSE_URL; 

/**
 * 1. FONKSİYON: CV'yi Yapay Zeka ile Okuma (OCR)
 * Bu fonksiyon dosya seçildiği anda çalışır ve içindeki metni döner.
 */
export const parseCVWithAI = async (file: File) => {
  try {
    if (!CV_PARSE_URL) {
      throw new Error("CV Parse URL (Environment Variable) bulunamadı!");
    }

    // Dosyayı okurken sadece saf base64 kısmını alıyoruz
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Header kısmını temizle: "data:application/pdf;base64," kısmını atar
        const base64Content = result.split(',')[1]; 
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });

    // Power Automate'e gönderim
    const response = await fetch(CV_PARSE_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      // Veriyi bir obje içinde gönderiyoruz ki PA tarafında tetikleyici bunu yakalayabilsin
      body: JSON.stringify({
        fileContent: base64,
        fileName: file.name
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Builder Hatası:", errorText);
      throw new Error("CV okunurken bir hata oluştu.");
    }

    // Power Automate'ten gelen temizlenmiş JSON verisini döner
    return await response.json();
    
  } catch (error) {
    console.error("CV Parse İşlemi Başarısız:", error);
    throw error;
  }
};

/**
 * 2. FONKSİYON: Formu Tamamen Gönderip SharePoint'e Kaydetme
 */
export const submitToPowerAutomate = async (data: CandidateApplication) => {
  try {
    if (!FLOW_URL) {
      throw new Error("Power Automate Başvuru URL'i bulunamadı!");
    }

    const response = await fetch(FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gönderim Hatası:", errorText);
      throw new Error("Başvuru iletilirken bir sorun oluştu.");
    }

    return { success: true };
  } catch (error) {
    console.error("API Hatası:", error);
    throw error;
  }
};