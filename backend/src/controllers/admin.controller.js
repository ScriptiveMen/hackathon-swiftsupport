const messageModel = require("../models/message.model.js");
const chatModel = require("../models/chats.model.js");
const userModel = require("../models/user.model.js");
const mongoose = require("mongoose");

const getMessagesLeadsAnalytics = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { filter } = req.query; // 7d, 30d, 6m, 12m

    let startDate = new Date();
    let grouping = "day"; // Default for short periods

    if (filter === "7d") {
      startDate.setDate(startDate.getDate() - 7);
      grouping = "day";
    } else if (filter === "30d") {
      startDate.setDate(startDate.getDate() - 30);
      grouping = "day";
    } else if (filter === "6m") {
      startDate.setMonth(startDate.getMonth() - 6);
      grouping = "month";
    } else if (filter === "12m") {
      startDate.setMonth(startDate.getMonth() - 12);
      grouping = "month";
    } else {
      // Default to 6m if not specified
      startDate.setMonth(startDate.getMonth() - 6);
      grouping = "month";
    }

    // 1. Get Messages Analytics
    // First, find all chats for this organization
    const chats = await chatModel.find({ organizationId }).select("_id");
    const chatIds = chats.map(c => c._id);

    const messagePipeline = [
      { $match: { chatId: { $in: chatIds }, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: grouping === "day" 
            ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            : { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const messageData = await messageModel.aggregate(messagePipeline);

    // 2. Get Leads (New Customers) Analytics
    const leadPipeline = [
      { $match: { organizationId: new mongoose.Types.ObjectId(organizationId), role: "customer", createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: grouping === "day"
            ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            : { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const leadData = await userModel.aggregate(leadPipeline);

    // 3. Format and Merge Data
    const result = [];
    const labels = new Set([...messageData.map(d => d._id), ...leadData.map(d => d._id)]);
    const sortedLabels = Array.from(labels).sort();

    sortedLabels.forEach(label => {
      const msg = messageData.find(d => d._id === label)?.count || 0;
      const lead = leadData.find(d => d._id === label)?.count || 0;
      
      let displayLabel = label;
      if (grouping === "month") {
        const [year, month] = label.split("-");
        const date = new Date(year, month - 1);
        displayLabel = date.toLocaleString('default', { month: 'short' });
      } else {
        const [year, month, day] = label.split("-");
        displayLabel = `${month}/${day}`;
      }

      result.push({
        label: displayLabel,
        messages: msg,
        leads: lead
      });
    });

    res.status(200).json({
      status: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ status: false, message: `Analytics Error: ${error.message}` });
  }
};

module.exports = {
  getMessagesLeadsAnalytics
};
