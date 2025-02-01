# AI-Powered To-Do Application

## Project Overview

This project is a to-do application that leverages AI to enhance task management. It provides users with a secure and personal space to organize their tasks, while also offering intelligent features like AI-powered task prioritization and smart reminders.

**Key Features:**

*   **Decentralized Task Management:** Your tasks are stored in a database, providing a personal and persistent to-do list experience.
*   **AI-Powered Task Prioritization:**  Utilizes Google Gemini AI to analyze your tasks and suggest priorities based on deadlines, task types, and descriptions.
*   **Smart Reminders:**  AI can suggest smart reminders based on task details and deadlines (feature in progress, basic reminder implemented).
*   **Task Analytics Dashboard:**  Provides visual insights into your task completion rate and task distribution by type.
*   **User Authentication:** Secure user registration and login system to protect your personal tasks.
*   **Responsive Frontend:** Built with Next.js, Typescript and Tailwind CSS for a modern and user-friendly experience across devices.
*   **RESTful API Backend:**  Backend built with Node.js, Express, and MongoDB to handle data management and API requests.
*   **AI Service Backend:**  Separate Python Flask service for AI processing, ensuring scalability and separation of concerns.

## Technologies Used

*   **Frontend:**
    *   Typescript
    *   Next.js
    *   Tailwind CSS
    *   Recharts (for analytics)
    *   Axios (for API requests)
    *   Context API (for state management)
*   **Backend (API):**
    *   Node.js
    *   Express.js
    *   MongoDB (with Mongoose)
    *   JSON Web Tokens (JWT) for Authentication
    *   CORS, Helmet (for security)
    *   dotenv (for environment variables)
*   **Backend (AI Service):**
    *   Python
    *   Flask
    *   Flask-CORS
    *   google-generativeai (Gemini API)
    *   dotenv
*   **Database:**
    *   MongoDB

## Setup Instructions

Follow these steps to get the project running locally:

**Prerequisites:**

*   **Node.js** (version >= 18 recommended) and **npm** (Node Package Manager) - [https://nodejs.org/](https://nodejs.org/)
*   **Python** (version >= 3.8 recommended) and **pip** (Python Package Installer) - [https://www.python.org/](https://www.python.org/)
*   **MongoDB** - [https://www.mongodb.com/](https://www.mongodb.com/) (Install MongoDB Community Server and ensure it's running)
*   **Google Cloud API Key:** You need a Google Cloud API Key with access to the Gemini API.
    *   Go to [Google Cloud Console](https://console.cloud.google.com/) and create a project (or select an existing one).
    *   Enable the "Generative Language API" for your project.
    *   Create API credentials (API key) and restrict it if needed.
    *   **Important:**  Store this API key securely in your `.env` files (see below).

**1. Backend Setup (API - Node.js/Express):**

*   Navigate to the `backend` directory in your project.
    ```bash
    cd backend
    ```
*   Install backend dependencies:
    ```bash
    npm install
    ```
*   **Configure Environment Variables:**
    *   Create a `.env` file in the `backend` directory.
    *   Add the following environment variables to `.env`, replacing placeholders with your actual values:

        ```env
        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/your_todo_db  # Replace with your MongoDB connection string
        JWT_SECRET=your_jwt_secret_key # Choose a strong, secret key for JWT
        JWT_EXPIRATION=1h # Optional: Set token expiration time (e.g., 1h, 1d, 7d)
        NODE_ENV=development # Set to 'production' for production environment
        CORS_ORIGIN=http://localhost:3000 # Origin for CORS in development (frontend URL)
        ```
        *   **`MONGODB_URI`:**  If you are running MongoDB locally with default settings, `mongodb://localhost:27017/your_todo_db` should work.  Replace `your_todo_db` with your desired database name. If your MongoDB setup is different (e.g., using MongoDB Atlas), update this connection string accordingly.
        *   **`JWT_SECRET`:**  **Crucially, replace `your_jwt_secret_key` with a strong, randomly generated secret key.** This is used to sign your JWT tokens and is essential for security.
*   Start the backend server:
    ```bash
    npm run dev # For development mode with nodemon (automatic restarts)
    # or
    npm start # For production-like start
    ```
    The backend server should now be running at `http://localhost:5000`.

**2. AI Service Setup (Python/Flask):**

*   Navigate to the `backend` directory (if you are not already there). Then, navigate to the `ai_service` directory (you might need to create this directory and move `agent.py` and `ai_service.py` into it if they are not already in a subdirectory):
    ```bash
    cd ai_service # Or create it and move files if necessary
    ```
*   **Create a Python Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    # Activate the virtual environment:
    # For Linux/macOS:
    source venv/bin/activate
    # For Windows:
    venv\Scripts\activate
    ```
*   Install AI service dependencies:
    ```bash
    pip install -r requirements.txt # If you have a requirements.txt
    # OR install dependencies individually if you don't have requirements.txt:
    pip install flask flask-cors google-generativeai python-dotenv
    ```
*   **Configure Environment Variables for AI Service:**
    *   Create a `.env` file in the `ai_service` directory.
    *   Add your Google API key:

        ```env
        GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY  # Replace with your actual API key
        ```
        **Replace `YOUR_GOOGLE_GEMINI_API_KEY` with the API key you obtained from Google Cloud Console.**
*   Start the AI service:
    ```bash
    python ai_service.py
    ```
    The AI service should now be running at `http://127.0.0.1:5001`.

**3. Frontend Setup (React/Next.js):**

*   Navigate back to the project root directory (or to the `frontend` directory if your project is structured that way).
    ```bash
    cd ../frontend  # Or cd frontend depending on your starting location
    ```
*   Install frontend dependencies:
    ```bash
    npm install
    ```
*   **Configure Environment Variables for Frontend (Optional):**
    *   While not strictly necessary for basic setup, you might want to create a `.env.local` file in the `frontend` directory if you need to configure frontend-specific environment variables in the future (e.g., different API base URLs for different environments).
    *   For now, the default `API_BASE_URL` in `frontend/utils/api.ts` is set to `http://localhost:5000/api`, which should work with the default backend setup.
*   Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application should now be accessible at `http://localhost:3000` in your web browser.

**4. Access the Application:**

*   Open your web browser and go to `http://localhost:3000`.
*   You should be able to register a new account or log in if you already have one.
*   Start adding tasks, and explore the AI prioritization and analytics features!

## Running the Application

Once all setup steps are complete and the backend, AI service, and frontend are running:

1.  **Access the Frontend:** Open your browser and go to `http://localhost:3000`.
2.  **Register or Login:** Create a new user account or log in with existing credentials.
3.  **Manage Tasks:** Add, update, delete, and complete tasks.
4.  **Explore Analytics:** View the Task Analytics dashboard for completion rates and task type distribution.
5.  **Use AI Prioritization:** Click the "AI Prioritized" button in the Task List to see AI-suggested task priorities.

**Important Notes:**

*   **API Keys Security:**  **Never commit your `GOOGLE_API_KEY` or `JWT_SECRET` directly into your version control system (like Git).**  Use `.env` files and ensure `.env` files are added to your `.gitignore` to prevent accidental commits.
*   **Google Gemini API Quota:** Be mindful of your Google Gemini API usage, especially during development and testing. If you exceed your quota, you may encounter rate limiting errors (HTTP 429). The AI service includes a retry mechanism with exponential backoff to handle temporary quota issues, but excessive usage might require you to request a quota increase from Google Cloud or optimize your application's API call frequency.
*   **Error Handling:** The application includes basic error handling, but for production deployments, you should enhance error logging and user feedback.
*   **Scalability and Deployment:** For production deployment, consider using a more robust database setup (e.g., MongoDB Atlas), deploying the backend and frontend to cloud platforms (like Heroku, AWS, Google Cloud, Vercel, Netlify), and potentially containerizing the application with Docker.

## Contributing

[Optional: If you want to make your project open for contributions]

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive commit messages.
4.  Submit a pull request to the main branch.

---

**Happy Task Managing!**
