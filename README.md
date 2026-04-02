# SocialConnect

SocialConnect is a full-stack social media web application that allows users to create posts, interact with others, and view a personalized feed. The project is built using modern web technologies including Next.js, Node.js, Prisma, and PostgreSQL.

## Features

User Authentication
Secure signup and login using JWT
Password hashing using bcrypt

Post Creation
Create posts with text and optional image upload
Posts are stored and displayed in the feed

Engagement
Like and unlike posts
Add and view comments

Social Features
Follow and unfollow users
View posts from followed users in a personalized feed

User Profile
View user information
See followers, following, and posts

## Tech Stack

Frontend
Next.js (App Router)
React
Tailwind CSS

Backend
Node.js
Express.js
Prisma ORM

Database
PostgreSQL

## Project Structure

SocialConnect/
frontend/ - Next.js frontend application
backend/ - Express and Prisma backend

## Setup Instructions

Clone the repository
git clone https://github.com/YOUR_USERNAME/socialconnect.git
cd socialconnect

Install dependencies

Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm run dev

Environment Variables

Create a .env file inside the backend folder and add:

DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key

## How It Works

Users sign up or log in
A JWT token is generated for authentication
Users can create posts with optional images
Backend processes requests and stores data in PostgreSQL
The feed displays posts from followed users

## Future Improvements

Pagination for posts
Real-time notifications
Chat functionality
Improved user interface
Deployment to cloud platforms


## Note

This project demonstrates full-stack development including frontend, backend, database design, and API integration.
