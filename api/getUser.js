import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Netlify & Vercel compatible format
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ totalUsers: data.users.length, users: data.users });
}
