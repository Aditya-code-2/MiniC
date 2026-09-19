import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      // Exchange code for token
      API.get(`/auth/exchange-code?code=${code}`)
        .then(res => {
          const { token, userId, role, name, email } = res.data;
          
          const user = { email, name, role, userId };
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userRole", role);

          window.location.href = "/";
        })
        .catch(err => {
          console.error("Code exchange failed", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center font-bold text-rose-500">
      <div className="animate-spin text-4xl mb-3">🧸</div>
      <p>Google se login ho raha hai, kripya intezar karein...</p>
    </div>
  );
};

export default OAuthSuccess;