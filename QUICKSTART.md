# Quick Start Guide for StorySharing Platform

## IMPORTANT: MongoDB Atlas Configuration

Before running the application, you MUST configure your MongoDB Atlas connection string:

1. Open `backend/.env`
2. Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas URI
3. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/storysharing?retryWrites=true&w=majority`

## Running the Application

### Terminal 1 - Backend Server
```powershell
cd backend
npm run dev
```

The backend will start on http://localhost:5000

### Terminal 2 - Frontend Development Server
```powershell
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

## First Time Setup Checklist

- [ ] MongoDB Atlas URI configured in `backend/.env`
- [ ] JWT_SECRET changed to a secure random string in `backend/.env`
- [ ] Both backend and frontend dependencies installed (`npm install`)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173

## Default Ports
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create a new account
3. After registration, you'll be automatically logged in
4. Click "Write Story" to create your first story
5. Explore features like liking, commenting, and bookmarking

## Troubleshooting

### Backend won't start
- Check if MongoDB URI is correctly set in `.env`
- Make sure port 5000 is not in use

### Frontend won't start
- Check if port 5173 is not in use
- Try `npm install` again if dependencies are missing

### Cannot connect to database
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Check if the connection string is correct
- Ensure your MongoDB Atlas cluster is running

## Features to Try

1. **Write a Story**: Click "Write Story" and publish your first story
2. **Like Stories**: Click the heart icon on any story
3. **Comment**: Go to a story detail page and add comments
4. **Bookmark**: Save stories to read later
5. **Profile**: View all your published stories and stats
6. **Reading Time**: Notice the estimated reading time on each story

Enjoy using StorySharing Platform! 📚✨
