/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { database } from "~/../firebase";

/**
 * Represents a user.
 */
interface User {
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
 * Represents the response from the API.
 */
interface APIResponse {
  message: string;
}

/**
 * Handles the POST request to add a user to Firestore.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<APIResponse | { error: string }>,
) => {
  if (req.method === "POST") {
    try {

      // Access user data from request body or headers if needed
      const { user }: { user: User } = req.body;
      // Get reference to user document
      const userRef = doc(database, "users", user.uid);

      // Check if user document already exists
      const userDoc = await getDoc(userRef);
      console.log('userDoc :>> ', userDoc);
      console.log("Firebase document ID:", userDoc.id);

      // If user document doesn't exist, add user to Firestore
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          image: user.photoURL,
          createdAt: user.metadata.creationTime,
          lastSignedInAt: user.metadata.lastSignInTime,
        });

        // Send success response
        res.status(200).json({ message: "User added to Firestore" });
      } else {
        // Send response indicating user already exists
        res.status(400).json({ message: "User already exists in Firestore" });
      }
    } catch (error) {
      // Log and send error response
      console.error("Error adding user to Firestore:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
export default handler;
