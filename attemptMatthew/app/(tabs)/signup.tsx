import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
  try {
    const res = await fetch("http://<YOUR_PUBLIC_EC2_IP>:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, username, password }),
    });

    // If HTTP error, read text and set as message
    if (!res.ok) {
      const text = await res.text();
      setMessage(text);
      return;
    }

    const text = await res.text();
    setMessage(text);
  } catch (err: any) {
    // err may not have message, so fallback
    setMessage(err?.message || "Unknown error occurred");
  }
};


  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignup} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
}
