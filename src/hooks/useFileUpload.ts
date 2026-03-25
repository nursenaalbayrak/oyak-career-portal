import { useState } from "react";
import { validateCV } from "../utils/validators";

export const useFileUpload = () => {
  const [fileData, setFileData] = useState<{ base64: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    // 1. Önce senin yazdığın validator ile kontrol edelim
    const check = validateCV(file);
    
    if (!check.isValid) {
      setError(check.message);
      setFileData(null);
      return;
    }

    // 2. Dosya geçerliyse, onu Base64 formatına (metne) çevirelim
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData({
        base64: reader.result as string,
        name: file.name,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return { fileData, error, handleFileChange };
};