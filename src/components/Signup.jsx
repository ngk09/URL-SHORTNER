import React, { useState } from "react";
import supabase from "../db/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 1️⃣ Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user.id;
      let profilePicUrl = null;

      // 2️⃣ If profile pic uploaded, store in Supabase Storage
      if (profilePic) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from("avatars") // bucket name
          .upload(`${userId}/${profilePic.name}`, profilePic);

        if (storageError) throw storageError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(`${userId}/${profilePic.name}`);

        profilePicUrl = publicUrlData.publicUrl;
      }

      // 3️⃣ Store user profile in "profiles" table
      const { error: dbError } = await supabase.from("profiles").insert([
        {
          id: userId,
          email,
          profile_pic: profilePicUrl,
        },
      ]);

      if (dbError) throw dbError;

      setMessage("✅ Signup successful! Check your email for verification.");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2>Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          style={{
            width: "100%",
            margin: "10px 0",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            background: "#ff758c",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Sign Up
        </button>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
      </form>
    </div>
  );
}
