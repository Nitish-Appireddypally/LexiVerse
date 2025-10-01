const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCase = async (req, res) => {
    // ... (paste the logic from your old POST "/" route here)
};

const getAllCases = async (req, res) => {
    // ... (paste the logic from your old GET "/" route here)
};

const getMyCases = async (req, res) => {
    // ... (paste the logic from your old GET "/my-cases" route here)
};

const updateCaseStatus = async (req, res) => {
    // ... (paste the logic from your old PUT "/:id" route here)
};

module.exports = {
    createCase,
    getAllCases,
    getMyCases,
    updateCaseStatus
};