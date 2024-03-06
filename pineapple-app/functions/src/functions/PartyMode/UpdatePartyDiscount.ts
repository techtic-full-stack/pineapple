import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import {logger} from "firebase-functions/v1";

/**
 * Updates the discount rate for a party based on the number of members in the party.
 */
const UpdatePartyDiscount = onDocumentUpdated({
  document: "parties/{partyId}",
  region: "europe-west1",
}, async (event) => {
  try {
    logger.info("UpdatePartyDiscount function called for partyId:", event.params.partyId);
    const party = event.data?.after.data();

    if (!party || !party.memberIds) {
      logger.warn("No party data or memberIds found");
      return null;
    }

    const discountRate = calculateDiscountRate(party.memberIds.length);

    await event.data?.after.ref.update({
      discountRate,
    });

    logger.info(`Discount rate updated to ${discountRate * 100}% for partyId: ${event.params.partyId}`);
    return;
  } catch (error) {
    logger.error("UpdatePartyDiscount function error:", error);
    return;
  }
});

const calculateDiscountRate = (memberCount: number) => {
  if (memberCount >= 5) return 0.2;
  if (memberCount === 4) return 0.15;
  if (memberCount === 3) return 0.1;
  if (memberCount === 2) return 0.05;
  return 0; // No discount for 1 member
};

export default UpdatePartyDiscount;
