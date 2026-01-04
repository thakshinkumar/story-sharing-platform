# StorySharing Platform 📚

A full-stack web application for sharing and discovering stories. Built with React, Vite, Tailwind CSS, Express.js, and MongoDB Atlas.

## Features ✨

### Core Features
- 📝 **Story Creation** - Write and publish your stories
- 💬 **Comments** - Engage with stories through comments
- ❤️ **Likes** - Show appreciation for stories you love
- 🔐 **User Authentication** - Secure login and registration with JWT

### Advanced Features
- 🔖 **Bookmarks** - Save favorite stories for later reading
- ⏱️ **Reading Time Estimator** - See how long each story takes to read
- 👤 **User Profiles** - View your published stories and stats
- 🎨 **Beautiful UI** - Modern design with advanced Tailwind CSS animations
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack 🛠️

### Frontend
- **React 18** with JSX
- **Vite** for fast development and building
- **Tailwind CSS** with custom animations and gradients
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for database
- **Mongoose** for MongoDB object modeling
- **JWT** for authentication
- **bcryptjs** for password hashing

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd d:\\StoryTellingApp
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Edit `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

   **Important:** Replace `MONGODB_URI` with your actual MongoDB Atlas connection string!

4. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the Application**

   In one terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure 📁

```
StoryTellingApp/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── StoryCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CreateStory.jsx
│   │   │   ├── StoryDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Bookmarks.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── utils/           # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── models/              # Database models
    │   ├── User.js
    │   ├── Story.js
    │   └── Bookmark.js
    ├── routes/              # API routes
    │   ├── auth.js
    │   ├── stories.js
    │   └── bookmarks.js
    ├── middleware/          # Custom middleware
    │   └── auth.js
    ├── server.js
    ├── .env
    └── package.json
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Stories
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get story by ID
- `GET /api/stories/user/me` - Get current user's stories
- `POST /api/stories` - Create new story (authenticated)
- `PUT /api/stories/:id` - Update story (authenticated)
- `DELETE /api/stories/:id` - Delete story (authenticated)
- `POST /api/stories/:id/like` - Like a story (authenticated)
- `DELETE /api/stories/:id/like` - Unlike a story (authenticated)

### Comments
- `POST /api/stories/:id/comments` - Add comment (authenticated)
- `DELETE /api/stories/:storyId/comments/:commentId` - Delete comment (authenticated)

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks (authenticated)
- `POST /api/bookmarks/:storyId` - Bookmark a story (authenticated)
- `DELETE /api/bookmarks/:storyId` - Remove bookmark (authenticated)

## Environment Variables 🔐

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## MongoDB Atlas Setup 🗄️

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `backend/.env`

## Features in Detail 🎯

### Story Bookmarking
Users can save their favorite stories to read later. Bookmarked stories are easily accessible from the Bookmarks page.

### Reading Time Estimator
Automatically calculates estimated reading time based on word count (average 200 words per minute).

### Advanced CSS
- Gradient backgrounds and text
- Smooth animations and transitions
- Hover effects and transforms
- Custom Tailwind components
- Responsive design for all screen sizes

## Contributing 🤝

Contributions are welcome! Feel free to submit issues and pull requests.

## License 📄

This project is open source and available under the MIT License.

## Author ✍️

Built with ❤️ using React, Vite, Tailwind CSS, and MongoDB Atlas

---

**Happy Story Sharing! 📖✨**
