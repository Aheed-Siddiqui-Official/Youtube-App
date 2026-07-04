# 5-YouTube App 🎬

A full-featured MERN (MongoDB, Express, React, Node.js) application that replicates the core functionality of YouTube with video hosting, user authentication, and community features.

## 🚀 Live Demo

**[Try the app on Vercel](https://5-youtube-app.vercel.app/)**

## 📋 Features

- **User Authentication**: Secure JWT-based authentication with refresh token rotation
- **Video Upload**: Upload videos with automatic processing and Cloudinary hosting
- **Video Management**: Edit, delete, and publish videos with metadata
- **Trending Content**: Browse and discover trending videos
- **Engagement Features**: Like, comment, and subscribe to creators
- **Playlists**: Create and manage custom video playlists
- **Watch History**: Automatic tracking of watched videos
- **User Channels**: View creator profiles with subscriber counts
- **Search Functionality**: Find videos and creators
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Updates**: Instant feedback on user interactions

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: Modern UI library
- **Vite 7.2.4**: Fast build tool and dev server
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client with interceptors
- **React Router**: Client-side routing

### Backend
- **Node.js & Express 5.2.1**: Server framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **Multer 2.0.2**: File upload handling
- **Cloudinary**: Cloud media hosting
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: Cookie handling

### Deployment
- **Vercel**: Serverless hosting for frontend & backend
- **MongoDB Atlas**: Cloud database
- **Cloudinary**: Media storage and delivery

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Git

### 1. Clone the repository:
```bash
git clone https://github.com/Aheed-Siddiqui-Official/Youtube-App.git
cd 5-youtube-app
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=8000
NODE_ENV=development
EOF

# Start development server
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_BACKEND_URL=http://localhost:8000/api/v1
EOF

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
5-youtube-app/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── index.js               # Server entry point
│   │   ├── constants.js           # App constants
│   │   ├── db/                    # Database connection
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── video.model.js
│   │   │   ├── comment.model.js
│   │   │   ├── like.model.js
│   │   │   ├── playlist.model.js
│   │   │   ├── subscription.model.js
│   │   │   └── tweet.model.js
│   │   ├── controllers/           # Route handlers
│   │   │   ├── userController.js
│   │   │   ├── videoController.js
│   │   │   ├── commentController.js
│   │   │   └── playlistController.js
│   │   ├── routes/                # API routes
│   │   │   ├── user.routes.js
│   │   │   ├── video.routes.js
│   │   │   ├── comment.routes.js
│   │   │   └── playlist.routes.js
│   │   ├── middlewares/           # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── multer.middleware.js
│   │   │   └── increaseViews.middleware.js
│   │   └── utils/                 # Utility functions
│   │       ├── ApiResponse.js
│   │       ├── ApiError.js
│   │       ├── asyncHandler.js
│   │       └── cloudinary.js
│   ├── public/                    # Static files
│   ├── package.json
│   ├── vercel.json                # Vercel configuration
│   └── Readme.md
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # Main App component
│   │   ├── index.css              # Global styles
│   │   ├── api/
│   │   │   ├── api.js             # Axios instance
│   │   │   └── axiosInterceptor.js # Request/response interceptors
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── video/             # Video components
│   │   │   ├── ui/                # Reusable UI components
│   │   │   └── sidebar/
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Liked.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Playlist.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Community.jsx
│   │   │   └── Settings.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx      # Route definitions
│   │   └── store/                 # Redux configuration
│   │       ├── store.js
│   │       └── slices/            # Redux slices
│   ├── public/
│   ├── package.json
│   ├── vercel.json                # Vercel configuration
│   └── vite.config.js
│
├── .git/
├── .gitignore
├── vercel.json                    # Monorepo Vercel config
└── README.md
```

## 🎯 Key Features Explained

### Authentication
- Register with email, username, password, avatar, and cover image
- Secure login with JWT tokens
- Automatic token refresh using refresh tokens
- HTTP-only cookies for token storage

### Video Management
- Upload videos with title, description, and thumbnail
- Videos are hosted on Cloudinary
- Edit video metadata (title, description, category)
- Delete videos
- View count tracking
- Publish/unpublish videos

### Engagement System
- **Like Videos**: Users can like/unlike videos
- **Subscribe**: Follow creators and track subscriptions
- **Comments**: Add comments to videos
- **Playlists**: Create custom playlists and add videos

### User Features
- User profiles with customizable cover images and avatars
- Subscriber count tracking
- Watch history
- Liked videos collection
- Created playlists
- Community posts (tweets)

## 🌐 Deployment

The application is deployed on **Vercel** with the following setup:

### Frontend & Backend on Vercel
1. **Frontend** serves the React app from `/`
2. **Backend** handles API requests at `/api/*`
3. Both services are configured in `vercel.json` with `experimentalServices`

### Environment Variables Required

**Frontend (.env)**:
```
VITE_BACKEND_URL=https://5-youtube-app.vercel.app/api/v1
```

**Backend (.env)**:
```
MONGODB_URI=your_mongodb_atlas_uri
CORS_ORIGIN=https://5-youtube-app.vercel.app
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=8000
NODE_ENV=production
```

### Deployment Steps:

1. Push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Redeploy on Vercel:
```bash
npx vercel --prod --yes
```

3. Add environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all required variables

## 🔧 API Endpoints

### User Routes
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/refresh-token` - Refresh access token
- `PATCH /api/v1/users/avatar` - Update user avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Video Routes
- `POST /api/v1/videos/upload-video` - Upload video
- `GET /api/v1/videos` - Get all published videos
- `GET /api/v1/videos/my-videos` - Get user's videos
- `GET /api/v1/videos/:videoId` - Get single video
- `PATCH /api/v1/videos/:videoId` - Update video
- `DELETE /api/v1/videos/:videoId` - Delete video

### Like Routes
- `POST /api/v1/likes/video/:videoId` - Like a video
- `DELETE /api/v1/likes/video/:videoId` - Unlike a video
- `GET /api/v1/likes/videos` - Get liked videos

### Comment Routes
- `POST /api/v1/comments/:videoId` - Add comment
- `DELETE /api/v1/comments/:commentId` - Delete comment
- `PATCH /api/v1/comments/:commentId` - Update comment

### Playlist Routes
- `POST /api/v1/playlists` - Create playlist
- `GET /api/v1/playlists` - Get user playlists
- `PATCH /api/v1/playlists/:playlistId` - Update playlist
- `DELETE /api/v1/playlists/:playlistId` - Delete playlist
- `POST /api/v1/playlists/:playlistId/add/:videoId` - Add video to playlist
- `DELETE /api/v1/playlists/:playlistId/remove/:videoId` - Remove from playlist

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Muhammad Aheed Siddiqui**
- GitHub: [@Aheed-Siddiqui-Official](https://github.com/Aheed-Siddiqui-Official)
- Portfolio: [aheed-siddiqui.vercel.app](https://aheed-siddiqui.vercel.app)

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### 413 Content Too Large Error
This error occurs when uploading large files. The backend is configured with 500MB limits, ensure Vercel environment has enough memory.

### CORS Errors
Check that `CORS_ORIGIN` environment variable matches your frontend URL exactly, including protocol and port.

### MongoDB Connection Issues
Ensure:
- IP whitelist includes Vercel IPs in MongoDB Atlas
- Connection string is correct and stored in environment variables
- Database user has proper permissions

### Cloudinary Upload Failures
Verify:
- Cloudinary credentials are correct
- Account has sufficient storage quota
- File size is within limits

---

Built with ❤️ using MERN Stack and Vercel

**Happy Coding! 🚀**
