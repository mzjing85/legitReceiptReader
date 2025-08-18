import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSignup = async () => {
  setLoading(true);
  setMessage(null);

  try {
    const res = await fetch("http://54.198.139.245:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        }),
    });

    const text = await res.text(); // <-- parse as text

    if (!res.ok) {
      setMessage(text || "Signup failed");
      setLoading(false);
      return;
    }

    // Automatically log in after signup
    login("dummy-token");
    setMessage(text); // this will show "Signup successful!"
  } catch (err: any) {
    setMessage(err?.message || "Network error");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title={loading ? "Signing up..." : "Sign Up"} onPress={handleSignup} disabled={loading} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "white" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  message: { marginTop: 15, textAlign: "center", color: "red" },
});
