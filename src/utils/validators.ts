import { OYAK_THEME } from "../constants/theme";

/**
 * Yüklenen dosyanın PDF olup olmadığını ve boyutunu kontrol eder.
 * @param file - Input'tan gelen dosya nesnesi
 * @returns { isValid: boolean, message: string }
 */
export const validateCV = (file: File) => {
  // 1. Tip Kontrolü
  if (!OYAK_THEME.config.allowedFileTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "Lütfen sadece PDF formatında bir dosya yükleyiniz.",
    };
  }

  // 2. Boyut Kontrolü
  if (file.size > OYAK_THEME.config.maxFileSize) {
    return {
      isValid: false,
      message: "Dosya boyutu 5MB'dan küçük olmalıdır.",
    };
  }

  return { isValid: true, message: "Dosya uygun." };
};

/**
 * E-posta formatının doğruluğunu kontrol eder.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};