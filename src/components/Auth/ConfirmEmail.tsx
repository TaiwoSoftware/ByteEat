// ConfirmEmail.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export const ConfirmEmail = () => {
  const [status, setStatus] = useState("Confirming...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus("Email confirmation failed.");
        return;
      }

      if (data?.session) {
        setStatus("Email confirmed! Redirecting...");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setStatus("Invalid or expired confirmation link.");
      }
    };

    confirm();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>{status}</p>
    </div>
  );
};
