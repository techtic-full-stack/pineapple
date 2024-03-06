import axios from "axios";

/**
 * Get a user to Firestore when they sign up
 */

const GetUserToFirestore = async (uid: string | Number) => {
  /**
   * Configuration object for making a GET request to retrieve user data from an API.
   */
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.API_URL}/api/get-user?uid=${uid}`,
    headers: {
      "Content-Type": "application/json",
    },
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

export default GetUserToFirestore;
