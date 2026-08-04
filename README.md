# CareReady Ontario

A responsive physical healthcare training platform prototype for Ontario personal
support workers and the wider care team. The application includes public course
previews, learner accounts, saved progress, knowledge checks, protocol reminders,
and placeholder Ontario training-funding information.

> All clinical and funding content is placeholder information. It requires review
> by qualified clinical, legal, privacy, and program stakeholders before formal use.

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS v4
- Supabase Auth and Postgres with row-level security
- Lucide icons

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

The interface runs in preview mode when Supabase is not configured. Preview mode
uses sample learner activity and does not persist changes.

## Enable accounts and saved progress

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
3. Apply `supabase/migrations/202608040001_initial_training_schema.sql` to the project.
4. Add the local and deployed `/auth/callback` URLs to the Supabase Auth redirect allow list.
5. Restart the development server.

The migration creates learner profiles, lesson progress, quiz attempts, and
protocol acknowledgements. Row-level security restricts each record to its owner.
Never expose a Supabase service-role key in this application.

## Update course material

Course modules and lesson content live in `src/content/course.ts`. The content is
separate from learner records so approved material can replace the prototype copy
without changing the account or progress model.

Before release:

- Replace every placeholder warning with approved Ontario and organization-specific guidance.
- Add controlled-document links and review schedules to the protocol reminders.
- Verify current funding details against official Ontario sources.
- Complete privacy, accessibility, clinical, and legal review.
- Do not collect patient or resident health information.

## Validation

```bash
npm run lint
npm run build
```
# CareReady
