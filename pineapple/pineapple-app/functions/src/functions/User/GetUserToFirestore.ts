/**
 * Get a user to Firestore when they sign up
 */

/**
 * Retrieves user data from an API and logs the response.
 * @param uid - The unique identifier of the user.
 */
const GetUserToFirestore = async (uid: string | number) => {
  /**
   * Configuration object for making a GET request to retrieve user data from an API.
   */
  let config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/get-user?uid=${uid}`,
      config
    );
    const data = await response.json();
    console.log(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export default GetUserToFirestore;
