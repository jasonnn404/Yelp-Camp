# YelpCamp

YelpCamp is a comprehensive web application for discovering, reviewing, and sharing campgrounds around the world. It features a Node.js/Express backend with a React frontend, interactive maps, user authentication, and a full review system.

![YelpCamp App](https://res.cloudinary.com/dtj513ynu/image/upload/v1/placeholder)

## 🚀 Features

- **Interactive Maps**: Browse campgrounds through an interactive cluster map
- **User Authentication**: Register, log in, and manage your profile
- **Campground Management**: Create, edit, and delete your campground listings
- **Reviews & Ratings**: Leave reviews and ratings for campgrounds
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Image Upload**: Upload multiple images for each campground
- **Geolocation**: View campgrounds on a map with precise location

## 🏗️ Architecture

This project uses a modern split architecture:

- **Backend**: Express.js RESTful API
- **Frontend**: React single-page application
- **Database**: MongoDB with Mongoose ODM
- **Maps**: MapTiler API for interactive mapping

## 🛠️ Technologies Used

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Passport.js (authentication)
- JOI (validation)
- Cloudinary (image storage)
- Helmet (security)

### Frontend
- React
- React Router
- Bootstrap 5
- Mapbox GL JS / React Map GL
- Axios
- React Bootstrap Icons

## 💻 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- MapTiler API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/YelpCamp.git
   cd YelpCamp
   ```

2. Install backend dependencies
   ```
   npm install
   ```

3. Install frontend dependencies
   ```
   cd reacttt
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables
   ```
   DB_URL=mongodb://localhost:27017/yelp-camp
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   MAPBOX_TOKEN=your_mapbox_token
   ```

### Running the Application

1. Start the Express backend server (port 3000)
   ```powershell
   cd D:\codes\Projects\Yelp-Camp
   node app.js
   ```

2. In a separate terminal, start the React frontend (port 3001)
   ```powershell
   cd D:\codes\Projects\Yelp-Camp\reacttt
   $env:PORT = "3001"
   npm start
   ```

3. Access the application:
   - Backend API: http://localhost:3000
   - Frontend React App: http://localhost:3001

### Seeding the Database

To populate the database with sample campgrounds:

```powershell
cd D:\codes\Projects\Yelp-Camp
node seeds/index.js
```

## 🧩 Project Structure

```
app.js                    # Express application entry point
middleware.js             # Custom middleware functions
reacttt/                  # React frontend application
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
models/                   # MongoDB models
routes/                   # Express route handlers
├── api/                  # API routes for React frontend
controllers/              # Business logic
utils/                    # Utility functions
views/                    # EJS templates for traditional views
public/                   # Static assets
```

## 📸 Screenshots

(Add screenshots here)

## 🔄 API Endpoints

### Campgrounds
- `GET /api/campgrounds` - Get all campgrounds
- `GET /api/campgrounds/map-data` - Get campground data optimized for maps
- `GET /api/campgrounds/:id` - Get a specific campground
- `POST /api/campgrounds` - Create a new campground
- `PUT /api/campgrounds/:id` - Update a campground
- `DELETE /api/campgrounds/:id` - Delete a campground

### Reviews
- `GET /api/campgrounds/:id/reviews` - Get reviews for a campground
- `POST /api/campgrounds/:id/reviews` - Create a review
- `DELETE /api/campgrounds/:id/reviews/:reviewId` - Delete a review

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/logout` - Logout a user

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_URL` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image storage |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `MAPBOX_TOKEN` | MapTiler API key |

## 🚧 Known Issues and Future Improvements

- Add user profile pages
- Implement password reset functionality
- Add filtering and search functionality
- Improve map performance with clustering
- Add social media sharing
- Implement user favorites/bookmarks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/) by Colt Steele for the original project idea
- [MapTiler](https://www.maptiler.com/) for the mapping APIs
- [Cloudinary](https://cloudinary.com/) for image hosting
- [Bootstrap](https://getbootstrap.com/) for UI components
