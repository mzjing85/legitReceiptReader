import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async () => {
    // Example: set a fake token
    await login("my-example-token");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Button title="Log in" onPress={handleLogin} />
    </View>
  );
}
