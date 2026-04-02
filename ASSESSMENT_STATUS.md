# NextJS Intern Technical Assessment R1 - Status

## Implemented
- JWT auth: register, login, logout (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`)
- Profile APIs:
  - `GET /api/users/:userId`
  - `PATCH /api/users/me`
  - `GET /api/users`
  - `POST /api/users/me/avatar` (Supabase-ready, local fallback)
- Post APIs:
  - `POST /api/posts`
  - `GET /api/posts`
  - `GET /api/posts/:postId`
  - `PATCH /api/posts/:postId`
  - `DELETE /api/posts/:postId` (soft delete via `isActive`)
- Like APIs:
  - `POST /api/posts/:postId/like`
  - `DELETE /api/posts/:postId/like`
- Comment APIs:
  - `POST /api/posts/:postId/comments`
  - `GET /api/posts/:postId/comments`
  - `DELETE /api/posts/:postId/comments/:commentId`
- Feed API:
  - `GET /api/feed` (chronological, pagination, follows-aware)
- Follow APIs:
  - `POST /api/users/:userId/follow`
  - `DELETE /api/users/:userId/follow`
  - `GET /api/users/:userId/followers`
  - `GET /api/users/:userId/following`
- Denormalized counters on `Post`: `likeCount`, `commentCount` (synced on mutations)
- Frontend pages: signup, login, feed (posts + like + comments), create post, profile

## Notes
- Username validation added: 3-30 chars, letters/numbers/underscore.
- Post/comment max length validations added.
- Image validation added for JPEG/PNG and 2MB max.

## Required next local commands
1. Free disk space (install currently fails with ENOSPC).
2. In `backend`:
   - `npm install`
   - `npx prisma migrate dev --name assessment_r1_complete`
   - `npx prisma generate`
   - `npm run dev`
3. In `frontend`:
   - `npm install`
   - create `.env.local` from `.env.local.example`
   - `npm run dev`
