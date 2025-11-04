// 전역 상태 관리: 로그인 상태 및 사용자 정보 관리
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AuthModal from "./AuthModal";

interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  userId: string; 
  setUserId: (id: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  profileText: string;
  setProfileText: (text: string) => void;
  website: string;
  setWebsite: (url: string) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  // userId: 로그인 아이디
  // userEmail: 이메일 주소
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profileText, setProfileText] = useState("");
  const [website, setWebsite] = useState("");
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // 새로고침 시 localStorage에서 로그인 정보 복원 (최초 1회만 실행)
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    const savedId = localStorage.getItem("userId") || "";
    const savedName = localStorage.getItem("userName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedProfile = localStorage.getItem("profileText") || "";
    const savedWebsite = localStorage.getItem("website") || "";
    if (savedLogin === "true" && savedId) {
      setLoggedIn(true);
      setUserId(savedId);
      setUserName(savedName);
      setUserEmail(savedEmail);
      setProfileText(savedProfile);
      setWebsite(savedWebsite);
    }
    setIsAuthLoaded(true);
  }, []);

  // 로그인 정보 localStorage 저장 (복원 후에만 실행되도록)
  useEffect(() => {
    if (!isAuthLoaded) return; // 초기 로딩 중에는 실행하지 않음
    
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("profileText", profileText);
      localStorage.setItem("website", website);
    } else {
      // 로그아웃 시 localStorage와 state 모두 초기화
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("profileText");
      localStorage.removeItem("website");
      setUserId("");
      setUserName("");
      setUserEmail("");
      setProfileText("");
      setWebsite("");
    }
  }, [isAuthLoaded, isLoggedIn, userId, userName, userEmail, profileText, website]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  if (!isAuthLoaded) {
    return null;
  }
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setLoggedIn,
      userId,
      setUserId,
      userName,
      setUserName,
      userEmail,
      setUserEmail,
      profileText,
      setProfileText,
      website,
      setWebsite,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
      <AuthModal open={authModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
}


