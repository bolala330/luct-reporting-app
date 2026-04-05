const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
initializeApp();

/**
 * Cloud Function: Triggered when a new report is submitted to Firestore.
 * Sends a push notification to the assigned PRL that a new report needs review.
 * Tech Stack: Node.js + Firebase Cloud Functions + Cloud Messaging
 */
exports.onReportSubmitted = onDocumentCreated(
  {
    document: "reports/{reportId}",
    region: "asia-southeast1", // Adjust to your closest region
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const reportData = snapshot.data();
    const prlId = reportData.prlId;

    if (!prlId) {
      console.log("No PRL assigned to this report's course.");
      return;
    }

    try {
      // 1. Fetch PRL's FCM token from Firestore 'users' collection
      const db = getFirestore();
      const prlDoc = await db.collection("users").doc(prlId).get();
      const prlData = prlDoc.data();

      if (!prlData || !prlData.fcmToken) {
        console.log(`PRL ${prlId} has no FCM token registered.`);
        return;
      }

      // 2. Construct the notification payload
      const message = {
        notification: {
          title: "New Lecture Report Submitted",
          body: `${reportData.lecturerName} submitted a report for ${reportData.courseCode} (${reportData.week}). Please review.`,
        },
        token: prlData.fcmToken,
        android: {
          priority: "high",
        },
      };

      // 3. Send via Firebase Cloud Messaging
      const response = await getMessaging().send(message);
      console.log("Successfully sent notification:", response);
      
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
);