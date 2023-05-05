# A Starter Kit for a Full-Stack ChatGPT Web App

## About

An ultimate starter template for building a full-stack, type-safe ChatGPT-powered web app. It uses:

- [OpenAI](https://platform.openai.com/docs) for calling the LLM that powers ChatGPT
- [Langchain](https://hwchase17.github.io/langchainjs/docs/overview) for LLM management
- [Next.js](https://nextjs.org/) for the web app
- [Prisma](https://www.prisma.io/) for database access
- [Turborepo](https://turborepo.com/) for monorepo management
- [tRPC](https://trpc.io/) for API routing
- [Tailwind](https://tailwindcss.com/) for styling

And much more!

## Folder structure

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 |   └─ src/router
 |       ├─ gpt-3.5-turbo (OpenAI Chat LLM powering ChatGPT)
 ├─ auth
     └─ authentication using next-auth.
 └─ db
     └─ typesafe db-calls using Prisma
```

## FAQ

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```sh
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm i

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
# Make sure you add the OPENAI_API_KEY environment variable!
cp .env.example .env

# Push the Prisma schema to your database
pnpm db:push
```

To set up Discord Authentication,

1. Create a new application on the (Discord Developer Portal)[https://discord.com/developers/applications]
2. Go to the `OAuth2` panel and copy the `Client ID` and `Client secret` into your `.env` file
3. Add `http://localhost:3000/api/auth/callback/discord` and `http://{{your_deployed_domain_name}}/api/auth/callback/discord` under Redirect URIs

By default, this template is configured with SQLite as the database provider. To configure a different database provider for deployment, make the following changes in `packages/db/prisma/schema.prisma`:

```diff
# In packages/db/prisma, update schema.prisma provider to use your own database provider
- provider = "sqlite"
- url      = "file:./db.sqlite"
+ provider = "postgresql"
+ url      = "_your_database_url_"
```

### Running locally

Run the following command:

```sh
> pnpm dev
```

## Deployment

### Next.js

#### Prerequisites

_I do not recommend deploying a SQLite database on serverless environments since the data wouldn't be persisted. I provisioned a quick Postgresql database on [Railway](https://railway.app), but you can of course use any other database provider. Make sure the Prisma schema is updated to use the correct database._

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com/). If you have ever deployed a Turborepo app there, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory and apply the following build settings:

<img width="927" alt="Vercel deployment settings" src="https://user-images.githubusercontent.com/11340449/201974887-b6403a32-5570-4ce6-b146-c486c0dbd244.png">

> The install command filters out the expo package and saves a few second (and cache size) of dependency installation. The build command makes us build the application using Turbo.

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy.

_(Note: Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.)_

## References

This starter template is built on the awesome (T3)[https://create.t3.gg/] stack. To learn more about the different technologies powering the stack, head over to `apps/nextjs/README.md`.
