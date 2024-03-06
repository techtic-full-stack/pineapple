import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {randomBytes} from "crypto";

const generateCode = () => {
  // Generate 3 bytes of data, which gives us 6 hexadecimal characters.
  const buffer = randomBytes(3);
  return buffer.toString("hex").toUpperCase().slice(0, 6);
};

/**
 * Generate a party code when a party is created
 */
const GeneratePartyCode = onDocumentCreated({
  document: "parties/{partyId}",
  region: "europe-west1",
}, (event) => {
  const code = generateCode();

  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  return snapshot.ref.update({
    code: code,
  });
});

export default GeneratePartyCode;
