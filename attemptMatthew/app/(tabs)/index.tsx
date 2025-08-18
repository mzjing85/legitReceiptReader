// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList } from "react-native";

// interface Profile {
//   id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
// }

// export default function Profiles() {
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("http://54.198.139.245:3000/profiles")
//       .then(res => res.json())
//       .then(data => setProfiles(data))
//       .catch(err => setError(err.message));
//   }, []);

//   return (
//     <View style={{ padding: 20 }}>
//       {error && <Text>Error: {error}</Text>}
//       <FlatList
//         data={profiles}
//         keyExtractor={item => item.id.toString()}
//         renderItem={({ item }) => (
//           <Text>{item.first_name} {item.last_name} ({item.username})</Text>
//         )}
//       />
//     </View>
//   );
// }

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    router.replace(isLoggedIn ? '/' : '/login');
  }, [isLoggedIn]);

  return null; // or a loading spinner
}

