import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  clearSelectedPackages,
  readSelectedPackages,
  saveSelectedPackage,
  type SelectedPackage,
} from "@/lib/package-selection";

interface AuthModalContextType {
  isOpen: boolean;
  mode: "login" | "signup";
  targetUrl: string;
  openLogin: (targetUrl?: string) => void;
  openSignUp: (targetUrl?: string) => void;
  closeModal: () => void;
  setMode: (mode: "login" | "signup") => void;
  selectedPackage?: SelectedPackage;
  selectPackage: (packageName: string, packageVersion?: string) => void;
  clearSelectedPackage: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

const DEFAULT_TARGET_URL = "https://agile.axi-global.com/aspx/signin.aspx";

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [targetUrl, setTargetUrl] = useState(DEFAULT_TARGET_URL);
  const [selectedPackage, setSelectedPackage] = useState<
    SelectedPackage | undefined
  >(() => readSelectedPackages()[0]);

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

  const selectPackage = useCallback(
    (packageName: string, packageVersion = "latest") => {
      saveSelectedPackage(packageName, packageVersion);
      setSelectedPackage({ packageName, packageVersion });
    },
    []
  );

  const clearSelectedPackage = useCallback(() => {
    clearSelectedPackages();
    setSelectedPackage(undefined);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      targetUrl,
      openLogin,
      openSignUp,
      closeModal,
      setMode,
      selectedPackage,
      selectPackage,
      clearSelectedPackage,
    }),
    [
      isOpen,
      mode,
      targetUrl,
      selectedPackage,
      selectPackage,
      clearSelectedPackage,
    ]
  );

  return (
    <AuthModalContext.Provider value={value}>
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
