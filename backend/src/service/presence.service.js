const userModel = require("../models/user.model.js");

const startInactivityCheck = () => {
  // Check every 5 minutes
  setInterval(async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      
      // Find users who haven't been seen for 15 minutes and are still marked as online/active
      const result = await userModel.updateMany(
        { 
          lastSeen: { $lt: fifteenMinutesAgo },
          $or: [{ isOnline: true }, { isActive: true }]
        },
        { 
          isOnline: false, 
          isActive: false,
          status: "Offline"
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`[Presence Service] Marked ${result.modifiedCount} users as inactive due to timeout.`);
      }
    } catch (error) {
      console.error("[Presence Service] Error during inactivity check:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

module.exports = { startInactivityCheck };
