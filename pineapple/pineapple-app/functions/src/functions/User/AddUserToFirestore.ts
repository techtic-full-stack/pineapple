/**
 * Add a user to Firestore when they sign up
 */

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

/**
 * Adds a user to Firestore.
 * @param {UserType} user - The user object to be added.
 * @returns {Promise<void>} - A promise that resolves when the user is added successfully.
 */
const AddUserToFirestore = async (user: UserType) => {
  const data = JSON.stringify({
    user,
  });

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };

  try {
    const response = await fetch(`${process.env.API_URL}/api/add-user`, config);
    const responseData = await response.json();
    console.log(JSON.stringify(responseData));
  } catch (error) {
    console.log(error);
  }
};

export default AddUserToFirestore;
