# CareReady Ontario

A responsive physical healthcare training platform prototype for Ontario personal
support workers and the wider care team. The application includes public course
previews, username-based learner accounts, saved progress, knowledge checks, and
protocol reminders.

> All clinical content is placeholder information. It requires review
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

## Enable username accounts and saved progress

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
3. Apply `supabase/migrations/202608040001_initial_training_schema.sql` to the project.
4. In Supabase Authentication → Sign In / Providers, keep the **Email** provider
   enabled and turn **Confirm email** off.
5. Restart the development server.

The migration creates learner profiles, lesson progress, quiz attempts, and
protocol acknowledgements. Row-level security restricts each record to its owner.
Never expose a Supabase service-role key in this application.

Learners create an account with a username and password; the interface never asks
for or verifies an email address. Supabase's password provider requires an email-shaped
identifier internally, so the app derives a reserved, non-deliverable address from
the username. This identifier is never shown to the learner or used for email.
Password recovery is therefore administrator-managed until a separate recovery-code
or identity-verification workflow is added.

## Update course material

Course modules live in the `modules` table and are edited from the in-app admin
area at `/admin`. Each module is one information lesson followed by one knowledge
check, and admins can create, edit, publish, unpublish, and delete them.

To enable the admin area:

1. Apply `supabase/migrations/202608040002_admin_authored_modules.sql` to the
   project. It creates the `modules` table, adds `profiles.is_admin`, and seeds
   the seven modules that previously lived in `src/content/course.ts`.
2. Create a learner account at `/sign-up` if you do not have one.
3. Promote it in the Supabase SQL editor. Accounts are keyed by username, not by
   email — `auth.users.email` holds a derived, non-deliverable
   `<username>@accounts.careready.invalid` address, so match on the username:

   ```sql
   update public.profiles set is_admin = true
   where id = (
     select id from auth.users
     where raw_user_meta_data->>'username' = 'your-username'
   )
   returning id, full_name, is_admin;
   ```

   An empty `returning` result means no row matched. List the available accounts
   with `select id, email, raw_user_meta_data->>'username' from auth.users;`.

4. Sign in again. **Module admin** appears in the sidebar.

Row-level security lets anyone read published modules, while inserts, updates,
deletes, and access to unpublished drafts require `is_admin`. Learners keep the
ability to edit their own name and role but can no longer write `is_admin`.

`src/content/course.ts` remains as the bundled fallback: it is what renders if
Supabase is unreachable or the migration has not been applied yet. Module slugs
are fixed after creation because saved progress is keyed on them.

Before release:

- Replace every placeholder warning with approved Ontario and organization-specific guidance.
- Add controlled-document links and review schedules to the protocol reminders.
- Complete privacy, accessibility, clinical, and legal review.
- Do not collect patient or resident health information.

## Validation

```bash
npm run lint
npm run build
```
# CareReady
