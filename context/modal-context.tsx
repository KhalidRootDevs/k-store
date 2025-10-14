"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AuthMode = "login" | "register";

interface ModalContextType {
  isLoginModalOpen: boolean;
  authMode: AuthMode;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  switchAuthMode: (mode: AuthMode) => void;
}

// Create a default context value
const defaultModalContext: ModalContextType = {
  isLoginModalOpen: false,
  authMode: "login",
  openLoginModal: () => {},
  openRegisterModal: () => {},
  closeAuthModal: () => {},
  switchAuthMode: () => {},
};

const ModalContext = createContext<ModalContextType>(defaultModalContext);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openLoginModal = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const closeAuthModal = () => setIsLoginModalOpen(false);

  const switchAuthMode = (mode: AuthMode) => setAuthMode(mode);

  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        authMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        switchAuthMode,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
