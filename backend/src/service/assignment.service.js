const userModel = require("../models/user.model");
const ticketModel = require("../models/ticket.model");

/**
 * Automatically assigns a ticket to the most suitable agent within an organization.
 * Priority: 
 * 1. Available & Online agents
 * 2. Busy & Online agents (secondary priority)
 * 3. Offline agents (fallback)
 * 
 * Logic within groups: Least Busy (fewest open tickets)
 */
async function autoAssignTicket(organizationId) {
    try {
        // 1. Get all agents in this organization
        const agents = await userModel.find({
            organizationId,
            role: "agent",
            isActive: true
        });

        if (!agents || agents.length === 0) {
            console.log(`No agents found for organization: ${organizationId}`);
            return null;
        }

        // 2. Prioritize by status
        // Group 1: Available & Online
        // Group 2: Busy & Online
        // Group 3: Offline (or status is Offline)
        
        const availableAgents = agents.filter(a => a.status === "Available" && a.isOnline);
        
        let targetPool = availableAgents;

        if (targetPool.length === 0) {
            console.log(`No available agents for org: ${organizationId}`);
            return null;
        }

        if (targetPool.length === 0) return null;

        // 3. Find the least busy agent in the target pool
        // Least busy = fewest tickets with status "open" or "in-progress"
        const agentWorkloads = await Promise.all(targetPool.map(async (agent) => {
            const count = await ticketModel.countDocuments({
                assignedTo: agent._id,
                status: { $in: ["open", "in-progress"] }
            });
            return { agentId: agent._id, count };
        }));

        // Sort by count ascending
        agentWorkloads.sort((a, b) => a.count - b.count);

        // 4. Return the best candidate
        return agentWorkloads[0].agentId;

    } catch (error) {
        console.error("Auto-assignment error:", error);
        return null;
    }
}

module.exports = {
    autoAssignTicket
};
