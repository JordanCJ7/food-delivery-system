# 🍔 Food Delivery System (Microservices Architecture)

This project is a scalable **Food Delivery System** built using **Node.js**, **Express**, **MongoDB**, **Docker**, and **React** — following a microservices architecture.

Each service handles a specific domain of the system such as authentication, restaurant management, order processing, delivery logistics, and payment handling. The frontend is a ReactJS app designed for customer interaction.

---

## 🧱 Project Structure

```bash
food-delivery-system/
│
├── auth-service/          # Handles authentication (login/signup, tokens)
├── restaurant-service/    # Manages restaurants and menu items
├── order-service/         # Processes customer orders
├── delivery-service/      # Manages delivery personnel and delivery statuses
├── payment-service/       # Handles payment gateway logic
├── frontend/              # React frontend for customer interface
├── docker-compose.yml     # Spins up all services
├── README.md              # You're here
└── .gitignore             # Ignores sensitive and unnecessary files

---

🚀 Getting Started
---

1. Clone the Repository

git clone https://github.com/JordanCJ7/food-delivery-system.git
cd food-delivery-system

2. Set Up Environment Files
Each service requires a .env file. Use the provided .env.example files:

cp auth-service/.env.example auth-service/.env
cp restaurant-service/.env.example restaurant-service/.env
cp order-service/.env.example order-service/.env
cp delivery-service/.env.example delivery-service/.env
cp payment-service/.env.example payment-service/.env

⚠️ Make sure to customize these .env files based on your local or cloud environment 
   ( MongoDB URIs, JWT secrets, etc.).

3. Start the System with Docker Compose
Ensure Docker and Docker Compose are installed.

docker-compose up --build

🧪 Services Overview

Service           | Port | Description
Auth Service      | 5000 | Login, Signup, Token handling
Restaurant Servic | 5001 | Manage restaurants and menus
Order Service     | 5002 | Handle order placement and tracking
Delivery Service  | 5003 | Delivery assignment and updates
Payment Service   | 5004 | Payment gateway simulation
Frontend (React)  | 3000 | Customer-facing interface

🧰 Tech Stack

Node.js + Express
MongoDB + Mongoose
ReactJS ( Frontend )
Docker + Docker Compose
JWT Authentication
Microservices Architecture

📦 Scripts
Each service supports typical npm scripts:

# Example for auth-service
cd auth-service
npm install       # Install dependencies
npm start         # Start service

# or use Docker
docker-compose up auth-service


📬 Contact
Maintainer: Janitha Gamage
Email: janithasuranjana2001@gmail.com.com
GitHub: github.com/JordanCJ7