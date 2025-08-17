import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
  try {
    const res = await fetch("http://<YOUR_PUBLIC_EC2_IP>:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Handle HTTP errors (like 401, 500)
    if (!res.ok) {
      const text = await res.text();
      setMessage(text);
      return;
    }

    const text = await res.text();
    setMessage(text); // e.g., "Login successful!"
  } catch (err: any) {
    // Network errors fallback
    setMessage(err?.message || "Unknown error occurred");
  }
};


  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}
