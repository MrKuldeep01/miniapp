# Project Title: Full Stack Web Application 
### with `Node.js`, `MongoDB`, `Express.js`, and `Server-Side Rendering`

## Overview
🚀 Excited to share my latest project! I’ve built an advanced full stack web application featuring user authentication and post management using Node.js, MongoDB, Express.js, and server-side rendering. This project allows users to register, log in, create and manage posts, like posts, and more—all while ensuring secure access through protected routes.

A big shoutout to Harsh Sir from Sheryians Coding School on YouTube for the amazing tutorials that guided me through this process.
This project is a full-featured web application built using Node.js, MongoDB, Express.js, and server-side rendering. It offers a rich set of functionalities, providing a robust platform for user interaction and content management. The application is designed with a focus on security and usability, ensuring that only authenticated users can access certain routes and perform specific actions.

## Features

- **User Authentication:**
  - New users can register.
  - Existing users can log in.
  - Users can log out.
  - Profile details can be edited.

- **Post Management:**
  - Users can create new posts.
  - View all posts.
  - Like posts and see like counts.
  - Authorized users can edit post content.
  - Delete specific posts.

- **Security:**
  - Most routes are protected and can only be accessed after logging in.

## Technology Stack

- **Node.js**: JavaScript runtime for building fast and scalable server-side applications.
- **Express.js**: Web framework for Node.js, providing a robust set of features for web and mobile applications.
- **MongoDB**: NoSQL database for storing user and post data.
- **Server-Side Rendering**: Enhances SEO and performance by rendering pages on the server before sending them to the client.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mrkuldeep01/miniapp.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd miniapp
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the application:**
   ```bash
   npm run start
   ```

5. **Open your browser and navigate to:**
   ```js
   http://localhost:3000
   ```

## Usage

1. **Register a new account or log in with an existing account.**
2. **Navigate through the application using the provided links and buttons.**
3. **Create, edit, and delete posts as per your authorization.**
4. **Like posts and view the like counts.**
5. **Edit your profile details if needed.**

## Routes

### Authentication Routes
- **Profile:** `/`
- **Register:** `/register`
- **Login:** `/login`
- **Logout:** `/logout`
- **Edit Profile:** `/edit-profile`

### Post Routes
- **Create Post:** `/posts/create`
- **View All Posts:** `/posts`
- **Edit Post:** `/posts/edit/:postId`
- **Delete Post:** `/posts/delete/:postId`
- **Like Post:** `/posts/like/:postId`

### Protected Routes
Most of the routes mentioned above are protected and can only be accessed after logging in.

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request. You can also open an issue to report bugs or request new features.

---

Feel free to reach out if you have any questions or suggestions. Happy coding!☕👨‍💻🚀