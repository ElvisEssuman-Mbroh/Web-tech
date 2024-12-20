# Campus Event Management System

This is a full-stack web application for managing campus events. The system includes user registration, event preferences, event listings, RSVP functionality, and event creation by admins. 

It is built using:
- **Frontend**: React.js
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB 

---

## Table of Contents
1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [How to Run](#how-to-run)
5. [API Endpoints](#api-endpoints)
6. [Deployed Link and Login Credentials](#deployed-link-and-login-credentials)
7. [Technologies Used](#technologies-used)
8. [Screenshots](#screenshots)

---

## Features

### 1. **User Registration & Event Preferences**
   - Users can register and log in.
   - Users can set their preferences for specific types of events.

### 2. **Event Listings & RSVP**
   - View a list of upcoming events with details:
     - Name, date, time, location, and available seats.
   - Users can RSVP for events:
     - Reduces the number of available seats dynamically.
     - Saves the event to the user's profile.

### 3. **Event Creation (Admin Only)**
   - Admins can create new events by providing:
     - Event name, date, time, location, description, and capacity.

### 4. **Event Calendar View**
   - Integrated calendar view to display events by date.
   - Users can filter events based on their preferences.

---

## Project Structure

The project is organized into **client** (frontend) and **server** (backend) folders:

```
Acity-Events/
│
├── client/                # React.js frontend
│   ├── public/            # Static files (index.html, assets)
│   ├── src/               # React components and styles
│   │   ├── App.js         # Main React component
│   │   ├── Login.js       # Login page component
│   │   ├── Signup.js      # Signup page component
│   │   ├── App.css        # Application styles
│   ├── package.json       # Frontend dependencies
│
├── server/                # Express.js backend
│   ├── index.js           # Entry point for the server
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│
└── README.md              # Project documentation
```

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v14+)
- **npm** or **yarn** (for dependency management)
- **MongoDB** (if you're using it as a database)

---

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `server` directory with the following:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string_here
     SECRET_KEY=your_jwt_secret_key_here
     ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`.

---

## How to Run

1. Start the backend server (from the `server` folder):
   ```bash
   npm start
   ```

2. Start the frontend server (from the `client` folder):
   ```bash
   npm start
   ```

3. Open your browser and go to:
   ```text
   http://localhost:3000
   ```

---

## API Endpoints

The backend exposes the following API endpoints:

### **User Management**
- **POST** `/api/register` - User registration.
- **POST** `/api/login` - User login.

### **Events**
- **GET** `/api/events` - Get a list of all events.
- **POST** `/api/events` - Create a new event (Admin only).
- **POST** `/api/events/:id/rsvp` - RSVP for an event.

---

## Deployed Link and Login Credentials

### Deployed Link
Access the application online:  
[Campus Event Management System](https://web-tech-pn7e.onrender.com/)

### Admin Login
- **Email**: admin@test.com  
- **Password**: admin123  

### User Login
- **Email**: elvisembh@gmail.com  
- **Password**: Elvis123  

---

## Technologies Used

### **Frontend**
- React.js
- React Router (if used)
- CSS for styling

### **Backend**
- Node.js
- Express.js
- MongoDB (Database, if applicable)

### **Tools**
- Insomnia/Postman for API testing
- npm for package management

---

## Screenshots

You can include relevant screenshots of your application here to showcase:
1. All events API test ![Screenshot 2024-12-17 002843](https://github.com/user-attachments/assets/4d623e29-2ac8-48a4-bccc-5f03ec9ce7dd)

2. Get Events(User Dashboard) API Test ![Screenshot 2024-12-17 002736](https://github.com/user-attachments/assets/28bab894-e16d-4b51-95b2-e351c49c17a6)
3. Admin Login API test ![Screenshot 2024-12-17 000931](https://github.com/user-attachments/assets/eb6f7b0a-2b02-4527-95f1-2a19d68d4322)
4. User Login API test ![Screenshot 2024-12-17 000824](https://github.com/user-attachments/assets/a3417ca1-c2d3-44de-a774-4ef9e04d1293)


---

## Author

**Elvis Essuman-Mbroh**  
Academic City University College  
Information Technology 

