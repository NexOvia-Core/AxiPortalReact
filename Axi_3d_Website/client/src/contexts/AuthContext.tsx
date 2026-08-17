import React, { createContext, useContext, useState } from "react";

interface AuthModalContextType {
  isOpen: boolean;
  mode: "login" | "signup";
  targetUrl: string;
  openLogin: (targetUrl?: string) => void;
  openSignUp: (targetUrl?: string) => void;
  closeModal: () => void;
  setMode: (mode: "login" | "signup") => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const DEFAULT_TARGET_URL = "https://agile.axi-global.com/aspx/signin.aspx";

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [targetUrl, setTargetUrl] = useState(DEFAULT_TARGET_URL);

  const openLogin = (url?: string) => {
    setMode("login");
    setTargetUrl(url || DEFAULT_TARGET_URL);
    setIsOpen(true);
  };

  const openSignUp = (url?: string) => {
    setMode("signup");
    setTargetUrl(url || DEFAULT_TARGET_URL);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        targetUrl,
        openLogin,
        openSignUp,
        closeModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
