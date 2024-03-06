import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, FlatList, View } from "react-native";
import { TParty } from "../../../utils/types";
import { getPartiesByUserId } from "../../../utils/firebase/PartyModeService";
import MediumPartyCard from "../../../components/Cards/MediumPartyCard";
import { useAuth } from "../../../utils/contexts/AuthContext";
import AddUserToFirestore from "../../../functions/src/functions/User/AddUserToFirestore";
import GetUserToFirestore from "../../../functions/src/functions/User/GetUserToFirestore";

export default function FeedScreen() {
  const [loading, setLoading] = useState(true);
  const [parties, setParties] = useState<TParty[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedParties = await getPartiesByUserId(user?.id || "");
        setParties(fetchedParties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    // AddUserToFirestore({
    //   uid: "35",
    //   displayName: "test",
    //   email: "test1223@gmail.com",
    //   phoneNumber: "1234512345",
    //   photoURL: "https://example.com/profile.jpg",
    //   metadata: {
    //     creationTime: "2022-03-10T12:00:00Z",
    //     lastSignInTime: "2022-03-10T12:00:00Z",
    //   },
    // });
    // GetUserToFirestore("35");
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={parties}
        horizontal
        style={styles.horizontalList}
        renderItem={({ item }) => (
          <MediumPartyCard party={item} key={item.id} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalList: {
    height: 150,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});
