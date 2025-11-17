const Transaction = require('../models/Transaction');
// 1. Import the AI model we configured
const aiModel = require('../ai/gemini'); 

// @desc    Get AI-powered budget suggestions
// @route   GET /api/user/budget-suggestions
exports.getBudgetSuggestions = async (req, res) => {
    try {
        // 1. Fetch user's transactions (last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const transactions = await Transaction.find({
            user: req.user.id,
            date: { $gte: ninetyDaysAgo }
        });

        // 2. Calculate average monthly income and expenses
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else if (t.type === 'expense') {
                totalExpense += t.amount;
            }
        });

        const avgMonthlyIncome = (totalIncome / 3).toFixed(2);
        const avgMonthlyExpense = (totalExpense / 3).toFixed(2);

        // --- START: REAL AI CALL ---
        
        // 3. Craft a detailed prompt for the AI
        const prompt = `
            You are FinAi, a helpful financial assistant. A user has an average monthly income of ₹${avgMonthlyIncome} and average monthly expenses of ₹${avgMonthlyExpense}.
            Based *only* on this data, suggest three monthly spending limit options: "Aggressive Saver", "Balanced", and "Flexible".
            
            Guidelines:
            - The "Aggressive Saver" limit should be well below their expenses.
            - The "Balanced" limit should be near their average expenses.
            - The "Flexible" limit should be slightly above their average expenses.
            - All limits must be whole numbers.
            - Provide a brief, encouraging, one-sentence description for each.
            
            Respond *only* with a valid JSON object in the following format:
            {
              "suggestions": [
                { "title": "Aggressive Saver", "limit": 0, "description": "" },
                { "title": "Balanced", "limit": 0, "description": "" },
                { "title": "Flexible", "limit": 0, "description": "" }
              ],
              "context": "Based on your average monthly income of ₹${avgMonthlyIncome} and expenses of ₹${avgMonthlyExpense}."
            }
        `;

        // 4. Call the Gemini API
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const aiText = await response.text();

        // 5. Clean and parse the AI's JSON response
        // The AI sometimes wraps its JSON in ```json ... ```, so we clean it.
        const cleanedJson = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
        const aiSuggestions = JSON.parse(cleanedJson);

        res.status(200).json(aiSuggestions);
        
        // --- END: REAL AI CALL ---

    } catch (error) {
        console.error("AI Budget Suggestion Error:", error);
        // If AI fails, send a fallback mock response
        res.status(500).json({ 
            suggestions: [
                { title: "Balanced", limit: 30000, description: "A balanced starting budget." }
            ],
            context: "Could not generate AI suggestions at this time."
        });
    }
};