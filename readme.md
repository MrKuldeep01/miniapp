# miniapp — Full Stack Web Application
### with `Node.js`, `MongoDB`, `Express.js`, and `Server-Side Rendering`

## Overview
A small full-stack app featuring user authentication and post management,
built with Node.js, MongoDB, Express.js, and server-side rendering (EJS).
Users can register, log in, create and manage posts, like posts, and edit
their profile — all behind protected routes.

Idea credit: Harsh Sir, Sheryians Coding School (YouTube).

See [`CLAUDE.md`](./CLAUDE.md) for implementation details, known issues, and
notes for anyone (human or AI) working on this codebase.

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

- **Feedback:**
  - Toast notifications for login/register/logout outcomes (wrong
    password, duplicate email, session expired, etc.) — shown once, then
    dismissed automatically.

## Technology Stack

- **Node.js**: JavaScript runtime for building fast and scalable server-side applications.
- **Express.js**: Web framework for Node.js, providing a robust set of features for web and mobile applications.
- **MongoDB**: NoSQL database for storing user and post data.
- **Server-Side Rendering**: Enhances SEO and performance by rendering pages on the server before sending them to the client.
- **Tailwind CSS (Play CDN) + Remix Icon**: styling and iconography, configured once in `views/partials/head.ejs`.

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

4. **Create a `.env` file** in the project root (see `.env.example`):
   ```
   PORT=3000
   DB_URI=<your MongoDB connection string>
   JWT_SECRET=<a long random string>
   ```

5. **Start the application:**
   ```bash
   npm start        # plain node
   npm run dev       # nodemon, auto-restarts on file changes
   ```

6. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
server.js            # entry point (loads config, connects DB, starts listening)
src/
  app.js              # express app assembly
  config/             # env loading + DB connection
  constants/          # shared literals
  models/             # Mongoose schemas
  middlewares/         # auth check, error handling, active-path + flash locals
  controllers/         # request handlers, grouped by resource
  routes/              # route → controller wiring, grouped by resource
  utils/                # JWT helpers, async error wrapper, flash cookie helper
views/
  partials/             # shared head/navbar/footer/toast fragments
  *.ejs                 # one template per page
public/                # static assets
```

See [`CLAUDE.md`](./CLAUDE.md) for the full breakdown and the reasoning
behind it.

## Usage

1. **Register a new account or log in with an existing account.**
2. **Navigate through the application using the provided links and buttons.**
3. **Create, edit, and delete posts as per your authorization.**
4. **Like posts and view the like counts.**
5. **Edit your profile details if needed.**

## Routes

### Authentication Routes
- **Profile:** `/`
- **Register:** `GET/POST /register`
- **Login:** `GET/POST /login`
- **Logout:** `GET /logout`
- **View another user's profile:** `GET /account/:id`
- **Edit Profile:** `GET/POST /profile/edit`

### Post Routes
- **Create Post:** `GET/POST /post/create`
- **View All Posts:** `GET /posts`
- **Edit Post:** `GET/POST /post/edit/:postId`
- **Delete Post:** `GET /post/delete/:postId`
- **Like Post:** `GET /post/like/:postId`

### Protected Routes
All routes except `/register`, `/login`, and `/logout` require a valid auth
cookie (set on login/register) and redirect to `/login` otherwise.

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request. You can also open an issue to report bugs or request new features.

---

Feel free to reach out if you have any questions or suggestions. Happy coding!☕👨‍💻🚀
