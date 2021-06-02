# Attendance System
This is an attendance system built with Next.js, TypeScript and Supabase.

## Steps to run locally
1. Go to [https://supabase.io](https://supabase.io)
2. Log in to your Supabase account using GitHub.
3. Create a new project, choose a database password and choose a region.
4. Wait till the database has succesfully been built.
5. Navigate to SQL.
6. Create a new query.
7. Copy the contents of [init.sql](database/init.sql) into the query and run it.
8. Navigate to Settings > Database.
9. Navigate to Settings > API.
10. Create a `.env` file in the project directory with the following contents:
```dotenv
SUPABASE_URL=[API URL]
SUPABASE_ANON_KEY=[Anonymous API Key]
SUPABASE_ADMIN_KEY=[Service Role API Key]
```
- The three values can be found under:
	- [API URL]: Settings > API > Config > URL
	- [Anonymous API Key]: Settings > API > API Keys > [anon][public]
	- [Anonymous API Key]: Settings > API > API Keys > [service_role][secret]
11. Run `npm run dev` or `npm exec next`
