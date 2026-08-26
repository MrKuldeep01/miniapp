# miniapp — Node/Express/MongoDB social mini-app

Small full-stack learning project: user auth (register/login/logout) + posts
(create/edit/delete/like) with server-side rendering (EJS).

Restructured into a layered module architecture (config / models /
middlewares / controllers / routes) following **SRP** (each file has one
job), **DRY** (JWT signing/verification, async error handling, and the auth
check are each written once and reused), and **KISS** (no service layer, no
DI container, no repository pattern — the app is small enough that
controllers talking to Mongoose models directly is the right amount of
abstraction).

## Stack

- **Express 4** — routing split into per-resource routers
- **MongoDB via Mongoose 8**
- **EJS** — server-side rendered views in `views/`
- **bcrypt** — password hashing
- **jsonwebtoken** — auth token stored in a `token` cookie (not `httpOnly`/`secure`)
- **nodemon** (devDependency) — `npm run dev` for local development; `npm start` runs plain `node`

## Structure

```
server.js                        # entry point: load config, connect DB, listen
src/
  app.js                         # express app assembly (middleware + routes wiring only)
  config/
    env.js                       # loads & validates process.env, exports typed config
    db.js                        # mongoose connection
  constants/
    index.js                     # shared literals (cookie name, default avatar/post images)
  models/
    user.model.js
    post.model.js
  middlewares/
    auth.middleware.js           # requireAuth — verifies the token cookie, sets req.user
    error.middleware.js          # notFoundHandler (404) + errorHandler (catch-all)
    locals.middleware.js         # exposePath — res.locals.path, for navbar active-link state
    flash.middleware.js          # consumeFlash — reads+clears the one-time flash cookie
  controllers/
    auth.controller.js           # register / login / logout
    user.controller.js           # profile, viewing another user, edit-profile
    post.controller.js           # create/list/edit/delete/like posts
  routes/
    auth.routes.js
    user.routes.js
    post.routes.js
    index.js                     # aggregates the three routers
  utils/
    token.js                     # signToken/verifyToken (single source of JWT_SECRET usage)
    asyncHandler.js              # wraps async controllers so rejections reach errorHandler
    flash.js                     # setFlash — writes the one-time flash cookie
views/
  partials/
    head.ejs                     # <head> contents: title, favicon, fonts, Tailwind config + design tokens
    navbar.ejs                   # authenticated top nav (needs `path` local for active-link state)
    guestHeader.ejs              # brand-only header for login/register/error
    footer.ejs                   # shared social-links footer
    toast.ejs                    # renders res.locals.flash as a dismissible toast
  *.ejs                          # one file per page — profile, login, register, createpost,
                                  # editPost, editProfile, postShow, emptyPosts, error
public/images/                   # static assets (served at /)
.env / .env.example              # PORT, DB_URI, JWT_SECRET
```

**Import direction is one-way:** `routes → controllers → models`, with
`middlewares` and `utils` used by both routes and controllers as needed.
Nothing in `models/` or `utils/` imports from `controllers/` or `routes/`.
Keep it that way — it's what makes each layer testable/replaceable in
isolation.

## Auth flow

- `src/utils/token.js` is the **only** place `jsonwebtoken` is used directly
  — `signToken`/`verifyToken` both read the secret from
  `src/config/env.js` (`process.env.JWT_SECRET`, falling back to a dev-only
  default if unset). Previously the secret was the hardcoded string
  `"shhhh"` repeated at three call sites in one file; if you're touching
  auth, there is now exactly one place to change it.
- `src/middlewares/auth.middleware.js` (`requireAuth`) reads the `token`
  cookie, verifies it, and sets `req.user = { email, userid }` on success —
  or redirects to `/login` (missing token *or* invalid/expired token; an
  invalid token also clears the cookie). Every protected route mounts this
  middleware instead of duplicating the check.
- Token is stored in a plain cookie (`res.cookie("token", token)`), no
  `httpOnly`/`secure`/`sameSite` options set — unchanged from the original,
  still worth hardening if this app is ever exposed beyond localhost.
- **`logout` redirects straight to `/login`, not `/`.** It used to go to `/`
  and let `requireAuth` bounce it to `/login` on the next hop — that
  indirection would have eaten the logout flash message (see below) before
  it was ever rendered, so it's a direct redirect now.

## Flash / toast notifications

One-time notifications (login errors, "please log in", logout confirmation,
etc.) are cookie-based, not session-based — there's no `express-session`
here, and `cookie-parser` was already a dependency, so reusing it kept this
DRY/KISS instead of pulling in a new package.

- `src/utils/flash.js` — `setFlash(res, type, message)` writes a short-lived
  `flash` cookie (`type` is `"success" | "error" | "warn" | "info"`). Call
  this right before a `res.redirect(...)`, same as you would with
  `req.flash()` in `connect-flash`.
- `src/middlewares/flash.middleware.js` (`consumeFlash`, mounted globally in
  `src/app.js` after `cookieParser`) reads that cookie into
  `res.locals.flash` on the **next** request and immediately clears the
  cookie — so a toast is shown exactly once, even across a page refresh.
- `views/partials/toast.ejs` renders `res.locals.flash` (if present) as a
  dismissible, auto-fading toast; it's included at the top of every page's
  `<body>`, right before the header partial. If you add a new page, include
  it there too — there's no shared layout file, so this is manual per page
  (consistent with how `navbar`/`footer` are already included).
- Current triggers: register success/duplicate-email, login
  success/wrong-password/unknown-email, logout, and `requireAuth` bouncing
  an unauthenticated or expired-session request to `/login`. Follow the
  same `setFlash(...); return res.redirect(...)` pattern for new ones —
  the flash must be set on the response that issues the redirect, not the
  one that renders the page.

## Routes (unchanged from before the restructure — see readme.md for the user-facing list)

| Method | Path | Router | Controller fn |
|---|---|---|---|
| GET/POST | `/register` | auth.routes | getRegister / postRegister |
| GET/POST | `/login` | auth.routes | getLogin / postLogin |
| GET | `/logout` | auth.routes | logout |
| GET | `/` | user.routes | getProfile |
| GET | `/account/:id` | user.routes | getAccount |
| GET/POST | `/profile/edit` | user.routes | getEditProfile / postEditProfile |
| GET/POST | `/post/create` | post.routes | getCreatePost / postCreatePost |
| GET | `/posts` | post.routes | listPosts |
| GET | `/post/nothing` | post.routes | emptyPosts |
| GET | `/post/like/:postId` | post.routes | likePost |
| GET | `/post/delete/:postId` | post.routes | deletePost (owner-only, silently no-ops otherwise) |
| GET/POST | `/post/edit/:postId` | post.routes | getEditPost / postEditPost (owner-only) |

Path prefixes stay singular `/post/...` except the plural `/posts` listing —
that's intentional, matching every `<a href>` in `views/*.ejs`; don't
"normalize" it without updating every view.

## What changed vs. the original flat `app.js`, and why

- **Split by responsibility.** The original had every route handler, the
  auth middleware, and `app.listen` in one 250-line file. Now: config
  loading, DB connection, route→handler wiring, and business logic per
  resource are each their own file.
- **DRY on JWT.** `jwt.sign`/`jwt.verify` were called ad hoc in three places
  with a hardcoded secret; consolidated into `utils/token.js`.
- **DRY on error handling.** Every `await` is now wrapped via
  `asyncHandler` and funneled into one `errorHandler` middleware (renders
  `views/error.ejs`) instead of each route either leaking `res.send(err)`
  (stack trace to the client) or crashing the process on a rejected
  promise.
- **Fixed a real bug, not just moved it.** The original `isLogin` redirected
  to `/login` on a missing token *without returning*, so it fell through to
  `jwt.verify(undefined, ...)` right after. `requireAuth` returns
  immediately in both the missing-token and invalid-token cases.
- **Removed a duplicate DB round-trip and a duplicate JWT verify.** The
  original `POST /profile/edit` re-verified the cookie with
  `jwt.verify(req.cookies.token, ...)` even though `isLogin` had already
  authenticated the request — `postEditProfile` now just uses `req.user`.
  The original `GET /post/like/:postId` fetched `postModel.find()` and
  never used the result — dropped.
- **Mongoose connection moved out of the model file.** `user.model.js`
  previously called `mongoose.connect()` as an import side effect (so the
  DB connection existed only because `app.js` happened to `require` that
  file first, and `post.model.js` silently depended on that ordering). The
  connection now lives in `src/config/db.js`, invoked explicitly from
  `server.js` before the server starts listening.
- **Every route path is unchanged.** The layered restructure (config /
  models / controllers / routes) was a pure refactor of the backend — all 16
  routes were verified to register identically (checked programmatically)
  and smoke tested against the real DB before/after. Views were later
  restyled (see UI system, above) but no route, form field, or template
  local contract changed as part of that pass either — verified the same
  way: every template rendered with representative locals, then a full
  register → post → like → edit → delete → logout flow was run against the
  real DB.

## UI system

Every page is Tailwind (Play CDN) + Remix Icon, configured once in
`views/partials/head.ejs`:
- `tailwind.config` there defines the `brand` color scale and the `Inter`
  font — don't hardcode raw indigo hex values or another font in a page,
  extend the config instead.
- A `<style type="text/tailwindcss"> @layer components { ... } </style>`
  block in the same partial defines reusable component classes: `.field`
  (inputs), `.label`, `.btn-primary` / `.btn-secondary` / `.btn-danger`,
  `.card`. Use these instead of repeating utility strings on every element —
  that's what replaced the ~80-line hand-written SVG social-icon block that
  used to be copy-pasted at the bottom of all 8 pages.
- `res.locals.path` is set globally by `src/middlewares/locals.middleware.js`
  (mounted in `src/app.js`) purely so `navbar.ejs` can highlight the active
  link — it carries no auth meaning, don't repurpose it for that.
- Static asset paths must be **absolute** (`/images/icon.png`), not
  relative (`../images/icon.png`) — the original relative form broke on any
  two-segment route (`/post/edit/:id`, `/account/:id`, etc.) because the
  browser resolves it against the current URL, not the file tree.
- `postShow.ejs` needs `currentUserId` (passed from `post.controller.js`'s
  `listPosts`) to decide whether to show the liked (filled heart) state and
  whether to show the edit/delete actions at all — previously edit/delete
  links were shown to every viewer regardless of ownership, even though the
  routes silently no-op or bounce non-owners.

## Working in this repo

This is a standalone learning project, not part of the KhataBuddy monorepo
conventions described in the root `CLAUDE.md` — don't apply i14-* patterns
(commons symlink, blue-green deploy, Bitbucket PR flow) here.
