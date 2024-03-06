// pages/api/get-user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { database } from "~/../firebase";

interface User {
  uid: string;
}

interface UserResponse {
  user: User | null;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse | { error: string }>,
) => {
  if (req.method === "GET") {
    try {
        console.log('req.query :>> ', req.query);
      // Access the user ID from the query parameters
      const { uid } = req.query;

      // Get reference to the user document
      const userRef = doc(database, "users", uid as string); // Assuming uid is provided as a query parameter

      // Fetch the user document from Firestore
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        res.status(200).json({ user: userData });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;