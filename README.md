# BookNest 📚

BookNest is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for managing books, orders, user authentication, and reviews.

## 🚀 Technologies Used

### Backend
- **Node.js & Express**: Core server and REST API framework.
- **MongoDB & Mongoose**: NoSQL database and object data modeling.
- **JWT & BcryptJS**: Secure user authentication and password hashing.
- **CORS & Dotenv**: Middleware and environment variable management.

### Frontend
- **React 18**: User interface library.
- **Vite**: Next-generation frontend tooling for fast development.
- **Tailwind CSS v4**: Utility-first CSS framework for styling.
- **React Router DOM**: Declarative routing for React.
- **Axios**: Promise-based HTTP client for API requests.
- **Lucide React**: Beautiful and consistent icons.

---

## 📂 Project Structure

```text
booknest/
├── config/           # Database configuration
├── controllers/      # Route controllers (Auth, Books, Orders, etc.)
├── frontend/         # React Vite Frontend App
├── middleware/       # Custom middleware (Error handling, Auth)
├── models/           # Mongoose schemas (User, Book, Order, Review)
├── routes/           # API routes definitions
├── .env              # Backend environment variables
├── package.json      # Backend dependencies and scripts
└── server.js         # Entry point for the backend server
```

---

## 🛠️ Setup & Installation

Follow these steps to set up the project locally.

### 1. Clone the repository
Ensure you have the project directory (`booknest`) available on your local machine.

### 2. Backend Setup
Navigate to the root directory and install dependencies:
```bash
cd booknest
npm install
```

Create a `.env` file in the root directory and add the following Environment Variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend server (runs on `http://localhost:5000` by default):
```bash
# For development with nodemon
npm run dev

# For standard execution
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd booknest/frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`. Make sure your API calls in the frontend are directed to the correct backend port (e.g., `5000`).

---

## 🌟 Features
- **Authentication**: User Registration and Login with JWT.
- **Role-Based Access**: Specialized functionality for normal Users and Admins.
- **Books Management**: View, add, edit, and delete books in the store.
- **Order Processing**: Users can place orders for books.
- **Reviews**: Users can leave reviews for books.
