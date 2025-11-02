# FinAi: AI-Powered Financial Assistant 🧠💸

FinAi is a smart financial application designed to provide an intelligent, automated, and simulated payment and expense tracking experience. This project leverages AI to offer smart budget suggestions and automatic transaction categorization, providing a prototype of a modern FinTech platform.

## Core Features

  * **Simulated Payment System**: A self-contained "sandbox" environment where users can send and receive fake money, simulating real-world UPI and bank transfers.
  * **AI-Powered Budgeting**: FinAi analyzes a user's income and spending habits to suggest intelligent, personalized monthly budget limits.
  * **Smart Transaction Categorization**: Utilizes a Large Language Model (LLM) to automatically categorize user transactions based on their descriptions, removing manual effort.
  * **Secure Authentication**: A complete user registration and login system using JWT (JSON Web Tokens) for secure, stateless authentication.
  * **Full Transaction History**: Users can view, add, and delete their transaction records.
  * **Rewards System (Simulated)**: A framework for rewarding users with points or fake "cashback" for meeting their budget goals.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

  * **Node.js**: Make sure you have Node.js and npm installed. You can download it [here](https://nodejs.org/).
  * **MongoDB**: You need a running MongoDB instance. You can install it locally using [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use a cloud service like MongoDB Atlas.
  * **Google AI API Key**: For the AI features, you'll need an API key from [Google AI for Developers](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/AkashMathad09/FinAi---Ai-Powered-Personal-Finance-Expense-and-Savings-Optimizer.git
    cd finai
    ```

2.  **Backend Setup**:

    ```bash
    # Navigate to the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file in the backend root and add the required environment variables (see below)

    # Start the server
    npm run dev
    ```

    The backend server will be running on `http://localhost:5000`.

3.  **Frontend Setup**:

    ```bash
    # (From the root 'finai' folder)
    # No installation needed for the vanilla HTML/CSS/JS frontend.
    # Just open the .html files in your browser, preferably using a live server extension in your code editor.
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```env
# Your MongoDB connection string (local or cloud)
MONGO_URI=mongodb://127.0.0.1:27017/finai

# Your secret key for signing JWTs
JWT_SECRET=your_super_secret_and_random_jwt_key

# Your API Key from Google AI for Developers
GEMINI_API_KEY=your_google_ai_api_key
```

## Project Structure

```
finai/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Application logic
│   ├── middleware/      # Security middleware (e.g., auth)
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Main server entry point
│
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── *.html           # HTML pages
│
└── README.md
```

## API Endpoints

Here is a list of the core API endpoints available.

| Method | Endpoint                    | Description                       | Protected |
| :----- | :-------------------------- | :-------------------------------- | :-------- |
| `POST` | `/api/auth/register`        | Register a new user               | No        |
| `POST` | `/api/auth/login`           | Log in a user                     | No        |
| `GET`  | `/api/transactions`         | Get all transactions for the user | Yes       |
| `POST` | `/api/transactions`         | Add a new transaction             | Yes       |
| `DELETE`| `/api/transactions/:id`     | Delete a specific transaction     | Yes       |
| `POST` | `/api/payments/send`        | Send fake money to another user   | Yes       |
| `GET`  | `/api/wallet`               | Get the user's current balance    | Yes       |
| `GET`  | `/api/budget/suggestions`   | Get AI-powered budget suggestions | Yes       |
