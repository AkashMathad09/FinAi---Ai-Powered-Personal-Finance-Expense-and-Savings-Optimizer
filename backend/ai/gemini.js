const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * AI function to categorize a transaction. (BYPASSED)
 * We will return "Other" to prevent AI-related crashes.
 */
async function getCategory(description) {
  console.log("AI getCategory BYPASSED. Returning 'Other'.");
  return "Other"; 
}

/**
 * AI function to get budget suggestions. (BYPASSED)
 * We will return realistic, hard-coded data.
 */
async function getAIBudgetSuggestion(avgIncome, avgExpense) {
    console.log("AI getAIBudgetSuggestion BYPASSED. Returning mock data.");

    // Convert inputs to numbers, just in case
    const avgExp = parseFloat(avgExpense) || 50000; // Use 50000 as a default

    // Create smart, realistic suggestions based on the user's average
    const mockSuggestions = {
      "suggestions": [
        { 
          "title": "Aggressive Saver", 
          "limit": Math.floor(avgExp * 0.8), // 80% of their average
          "description": "A great plan to boost your savings quickly." 
        },
        { 
          "title": "Balanced", 
          "limit": Math.floor(avgExp), // 100% of their average
          "description": "This matches your current spending habits." 
        },
        { 
          "title": "Flexible", 
          "limit": Math.floor(avgExp * 1.15), // 115% of their average
          "description": "Gives you a little extra room for comfort." 
        }
      ]
    };

    // Return the suggestions in a promise to simulate an async call
    return Promise.resolve(mockSuggestions.suggestions);
}

// Export the bypassed functions
module.exports = { getCategory, getAIBudgetSuggestion };