import { CandidateApplication } from "../types/candidate";

// .env.local dosyasındaki NEXT_PUBLIC_FLOW_URL değişkenini okuyoruz
const FLOW_URL = process.env.NEXT_PUBLIC_FLOW_URL;

export const submitToPowerAutomate = async (data: CandidateApplication) => {
  try {
    // Eğer URL gelmezse hata fırlat (Vercel ayarlarını unutursak diye bir sigorta)
    if (!FLOW_URL) {
      throw new Error("Power Automate URL (Environment Variable) bulunamadı!");
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
      console.error("Power Automate Hatası:", errorText);
      throw new Error("Başvuru gönderilirken bir hata oluştu.");
    }

    return { success: true };
  } catch (error) {
    console.error("API Hatası:", error);
    throw error;
  }
};