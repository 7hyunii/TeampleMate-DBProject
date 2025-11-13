"use client";
import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  // AuthProvider의 전역 로그인 상태 setter 및 사용자 정보 setter 사용
  const { setLoggedIn, setUserId, setUserName, setUserEmail, setProfileText, setWebsite } = useAuth();
  // 로그인/회원가입 모드 상태
  const [isLogin, setIsLogin] = useState(true);
  // 입력값 상태
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // 결과 메시지 상태
  const [message, setMessage] = useState("");
  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 모달이 닫힐 때 입력값/메시지 초기화
  React.useEffect(() => {
    if (!open) {
      setUid("");
      setPassword("");
      setName("");
      setMessage("");
      setLoading(false);
    }
  }, [open]);

  // 폼 제출 핸들러 (로그인/회원가입)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (isLogin) {
        // 로그인 API 호출
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, password }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.msg || "로그인 성공");
          setLoggedIn(true); // 전역 로그인 상태 true로 변경
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
        // 회원가입 API 호출
        const res = await fetch("http://localhost:8000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, password, name }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.msg || "회원가입 성공");
          setIsLogin(true); // 회원가입 후 로그인 화면으로 전환
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
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        {/* 로그인/회원가입 폼 */}
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
            maxLength={72} // bcrypt는 72자까지만 지원
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* 회원가입 모드일 때만 이름 입력 */}
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
        {/* 결과 메시지 출력 */}
        {message && (
          <div className="mt-2 text-center text-sm text-red-500">{message}</div>
        )}
        {/* 모드 전환 링크 */}
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
