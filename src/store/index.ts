import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";

// Defina uma chave secreta para criptografia/descriptografia
const secretKey = "chave-secreta";

// Função para criptografar o estado antes de armazenar
const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Função para descriptografar o estado quando recuperado
const decryptData = (data: string): string => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Defina a interface para o estado da store
interface BearState {
  bears: number;
  addABear: () => void;
}

// Criação da store com persistência e criptografia
export const useBearStore = create<BearState>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: "food-storage", // nome do item no storage
      storage: createJSONStorage(() => sessionStorage), // Altere para 'localStorage' se preferir
      // Serializa o estado antes de armazenar (criptografando)
      serialize: (state) => {
        const jsonState = JSON.stringify(state);
        return encryptData(jsonState); // Criptografa o estado
      },
      // Deserializa o estado após recuperar (descriptografando)
      deserialize: (str) => {
        const decryptedData = decryptData(str); // Descriptografa o estado
        return JSON.parse(decryptedData); // Converte de volta para objeto
      },
    }
  )
);
