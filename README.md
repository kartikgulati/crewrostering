# Crew Launch Verification

Production-oriented Next.js application for managing restaurant product launch training, crew verification quizzes, admin reporting, and PDF exports.

## Stack

- Next.js 15 App Router
- Tailwind CSS
- Prisma ORM with PostgreSQL
- NextAuth credentials login for admin access
- React Hook Form + Zod
- Zustand + React Query
- TipTap rich text editing
- Cloudinary image uploads
- PDFKit export generation

## Features

- Public mobile-first crew flow with no login
- One active launch module at a time
- Rich launch content with images
- Multiple-choice quiz with score breakdown and answer review
- Duplicate submission prevention by `name + store number + date`
- Secure admin panel for launch creation, activation, analytics, filtering, and exports
- Leaderboard and store-level completion stats
- Optional AI-assisted quiz suggestions derived from content

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

4. Push the Prisma schema:

```bash
npm run db:push
```

5. Seed sample data:

```bash
npm run seed
```

6. Start the app:

```bash
npm run dev
```

## Admin Login

- URL: `/admin/login`
- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`
- For stronger security in production, provide `ADMIN_PASSWORD_HASH` instead of storing a plain password.

To generate a bcrypt hash locally:

```bash
node -e "require('bcryptjs').hash(process.argv[1],10).then(console.log)" "YourStrongPassword"
```

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Configure environment variables from `.env.example`.
3. Use a PostgreSQL database from Supabase or Neon.
4. Add Cloudinary credentials if you want direct image uploads.
5. Run `prisma generate && prisma db push && next build` during deployment or in a pre-deploy migration step.

### Database

- Recommended providers: Supabase or Neon
- Prisma provider is set to `postgresql`

### Storage

- Cloudinary is supported by `/api/admin/uploads`
- If Cloudinary variables are missing, uploads are blocked and editors can still insert hosted image URLs manually

## Folder Structure

- `app/launch`: public crew experience
- `app/admin`: secure admin interface
- `app/api`: auth, quiz, submission, analytics, export, upload, and AI suggestion routes
- `components`: UI, crew flow, admin dashboard, editor
- `lib`: auth, Prisma, grading, PDF, content rendering, validation
- `prisma`: schema and seed data

## Production Notes

- Only one launch is active at a time through transactional activation
- Crew cannot submit without answering every question
- Duplicate submissions are prevented at the database layer
- PDF export is server-side and does not expose submission data client-side unnecessarily
- Middleware protects `/admin`

## Known Operational Requirements

- A running PostgreSQL instance is required before the app can render data-backed pages
- Cloudinary is optional but recommended for non-technical managers who need direct image uploads
- The AI suggestion endpoint is deterministic placeholder logic; swap it for a real LLM call if you want model-backed authoring assistance
