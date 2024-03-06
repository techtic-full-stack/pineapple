import axios from "axios";

/**
 * Add a user to Firestore when they sign up
 */
// const AddUserToFirestore = functions.region("europe-west1").auth.user().onCreate(async (user) => {
//   const db = firestore();
//   const userRef = db.collection("users").doc(user.uid);
//   const userDoc = await userRef.get();
//   if (!userDoc.exists) {
//     await userRef.set({
//       id: user.uid,
//       name: user.displayName,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       image: user.photoURL,
//       createdAt: user.metadata.creationTime,
//       lastSignedInAt: user.metadata.lastSignInTime,
//     });
//     logger.info("User added to Firestore", {structuredData: true});
//   }
//   return;
// });
interface UserType {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

const AddUserToFirestore = async (user: UserType) => {
  /**
   * Represents the data to be stored in Firestore.
   * @typedef {Object} FirestoreData
   * @property {Object} user - The user object.
   */
  const data = JSON.stringify({
    user,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.API_URL}/api/add-user`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

export default AddUserToFirestore;
