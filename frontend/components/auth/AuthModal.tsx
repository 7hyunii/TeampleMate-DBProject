"use client";
import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { setLoggedIn, setUserId, setUserName, setUserEmail, setProfileText, setWebsite } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!open) {
      setUid("");
      setPassword("");
      setName("");
      setMessage("");
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (isLogin) {
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, password }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.msg || "로그인 성공");
          setLoggedIn(true);
          setUserId(uid);
          setUserName(data.name || "");
          setUserEmail(data.email || "");
          setProfileText(data.profile_text || "");
          setWebsite(data.website_link || "");
          onClose();
        } else {
          setMessage(data.detail || "로그인 실패");
        }
      } else {
        const res = await fetch("http://localhost:8000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, password, name }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.msg || "회원가입 성공");
          setIsLogin(true);
        } else {
          setMessage(data.detail || "회원가입 실패");
        }
      }
    } catch (err) {
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            className="border rounded px-3 py-2"
            required
            value={uid}
            onChange={e => setUid(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="border rounded px-3 py-2"
            required
            maxLength={72}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="text"
              placeholder="이름"
              className="border rounded px-3 py-2"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 mt-2 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
          </button>
        </form>
        {message && (
          <div className="mt-2 text-center text-sm text-red-500">{message}</div>
        )}
        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
              계정이 없으신가요?{' '}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setIsLogin(false)}
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setIsLogin(true)}
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}