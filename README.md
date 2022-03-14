# scheduler

Fork of the lovely https://github.com/calcom/cal.com.

## Cheatsheet

### Reset migrations and seed
```shell
npx prisma migrate reset
```

### Test locally using heroku-cli and Procfile
```shell
heroku local web -p 3000
```

### Debug segfault on Heroku
See https://httptoolkit.tech/blog/how-to-debug-node-segfaults/
```shell
find node_modules -iname "*.node"
```

### Flush DNS cache on MacOS Chrome

`chrome://net-internals/#dns`
```shell
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
```

## Setup

- Node.js v16
- PostgreSQL
- Yarn

## Development

### Setup

```shell
git clone https://github.com/diglactic/scheduler
cd scheduler
cp apps/web/.env.example apps/web/.env
cp packages/prisma/.env.example packages/prisma/.env
yarn
```

#### Quick start with `yarn dx`

> - **Requires Docker and Docker Compose to be installed**
> - Will start a local Postgres instance with a few test users - the credentials will be logged in the console

```shell
yarn dx
```

#### Manual setup

1. Configure environment variables in the .env file. Replace `<user>`, `<pass>`, `<db-host>`, `<db-port>` with their
   applicable values

   ```dotenv
   DATABASE_URL="postgresql://<user>:<pass>@<db-host>:<db-port>"
   ```

1. Set a 32 character random string in your .env file for the `CALENDSO_ENCRYPTION_KEY` (You can use a command
   like `openssl rand -base64 24` to generate one).
1. Set up the database using the Prisma schema (found in `apps/web/prisma/schema.prisma`)

   ```shell
   yarn workspace @calcom/prisma db-deploy
   ```

1. Run (in development mode)

   ```shell
   yarn dev
   ```

#### Setting up your first user

1. Open [Prisma Studio](https://www.prisma.io/studio) to look at or modify the database content:

   ```shell
   yarn db-studio
   ```

1. Click on the `User` model to add a new user record.
1. Fill out the fields `email`, `username`, `password`, and set `metadata` to empty `{}` (remembering to encrypt your
   password with [BCrypt](https://bcrypt-generator.com/)) and click `Save 1 Record` to create your first user.
   > New users are set on a `TRIAL` plan by default. You might want to adjust this behavior to your needs in the `apps/web/prisma/schema.prisma` file.
1. Open a browser to [http://localhost:3000](http://localhost:3000) and login with your just created, first user.

### E2E-Testing

```shell
# In first terminal
yarn dx
# In second terminal
yarn workspace @calcom/web test-e2e

# To open last HTML report run:
yarn workspace @calcom/web playwright-report
```

### Upgrading from earlier versions

1. Pull the current version:

   ```shell
   git pull
   ```

2. Apply database migrations by running <b>one of</b> the following commands:

   In a development environment, run:

   ```shell
   yarn workspace @calcom/prisma db-migrate
   ```

   (this can clear your development database in some cases)

   In a production environment, run:

   ```shell
   yarn workspace @calcom/prisma db-deploy
   ```

3. Check the `.env.example` and compare it to your current `.env` file. In case there are any fields not present in your
   current `.env`, add them there.

   For the current version, especially check if the variable `BASE_URL` is present and properly set in your environment,
   for example:

   ```
   BASE_URL='https://yourdomain.com'
   ```

4. Start the server. In a development environment, just do:

   ```shell
   yarn dev
   ```

   For a production build, run for example:

   ```shell
   yarn build
   yarn start
   ```

## Deployment

### Docker

The Docker configuration for Cal is an effort powered by people within the community. Cal.com, Inc. does not provide
official support for Docker, but we will accept fixes and documentation. Use at your own risk.

If you want to contribute to the Docker repository, [reply here](https://github.com/calcom/docker/discussions/32).

The Docker configuration can be found [in our docker repository](https://github.com/calcom/docker).

### Heroku

<a href="https://heroku.com/deploy?template=https://github.com/calcom/cal.com">
  <img width="185px" height="auto" src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

## Integrations

### Obtaining the Google API Credentials

1. Open [Google API Console](https://console.cloud.google.com/apis/dashboard). If you don't have a project in your
   Google Cloud subscription, you'll need to create one before proceeding further. Under Dashboard pane, select Enable
   APIS and Services.
2. In the search box, type calendar and select the Google Calendar API search result.
3. Enable the selected API.
4. Next, go to the [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) from the side pane.
   Select the app type (Internal or External) and enter the basic app details on the first page.
5. In the second page on Scopes, select Add or Remove Scopes. Search for Calendar.event and select the scope with scope
   value `.../auth/calendar.events`, `.../auth/calendar.readonly` and select Update.
6. In the third page (Test Users), add the Google account(s) you'll using. Make sure the details are correct on the last
   page of the wizard and your consent screen will be configured.
7. Now select [Credentials](https://console.cloud.google.com/apis/credentials) from the side pane and then select Create
   Credentials. Select the OAuth Client ID option.
8. Select Web Application as the Application Type.
9. Under Authorized redirect URI's, select Add URI and then add the
   URI `<Cal.com URL>/api/integrations/googlecalendar/callback` replacing Cal.com URL with the URI at which your
   application runs.
10. The key will be created and you will be redirected back to the Credentials page. Select the newly generated client
    ID under OAuth 2.0 Client IDs.
11. Select Download JSON. Copy the contents of this file and paste the entire JSON string in the .env file as the value
    for GOOGLE_API_CREDENTIALS key.

### Obtaining Microsoft Graph Client ID and Secret

1. Open [Azure App Registration](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and select New registration
2. Name your application
3. Set **Who can use this application or access this API?** to **Accounts in any organizational directory (Any Azure AD
   directory - Multitenant)**
4. Set the **Web** redirect URI to `<Cal.com URL>/api/integrations/office365calendar/callback` replacing Cal.com URL
   with the URI at which your application runs.
5. Use **Application (client) ID** as the **MS_GRAPH_CLIENT_ID** attribute value in .env
6. Click **Certificates & secrets** create a new client secret and use the value as the **MS_GRAPH_CLIENT_SECRET**
   attribute

### Obtaining Zoom Client ID and Secret

1. Open [Zoom Marketplace](https://marketplace.zoom.us/) and sign in with your Zoom account.
2. On the upper right, click "Develop" => "Build App".
3. On "OAuth", select "Create".
4. Name your App.
5. Choose "User-managed app" as the app type.
6. De-select the option to publish the app on the Zoom App Marketplace.
7. Click "Create".
8. Now copy the Client ID and Client Secret to your .env file into the `ZOOM_CLIENT_ID` and `ZOOM_CLIENT_SECRET` fields.
9. Set the Redirect URL for OAuth `<Cal.com URL>/api/integrations/zoomvideo/callback` replacing Cal.com URL with the URI
   at which your application runs.
10. Also add the redirect URL given above as a allow list URL and enable "Subdomain check". Make sure, it says "saved"
    below the form.
11. You don't need to provide basic information about your app. Instead click at "Scopes" and then at "+ Add Scopes". On
    the left, click the category "Meeting" and check the scope `meeting:write`.
12. Click "Done".
13. You're good to go. Now you can easily add your Zoom integration in the Cal.com settings.

### Obtaining Daily API Credentials

1. Open [Daily](https://www.daily.co/) and sign into your account.
2. From within your dashboard, go to the [developers](https://dashboard.daily.co/developers) tab.
3. Copy your API key.
4. Now paste the API key to your .env file into the `DAILY_API_KEY` field in your .env file.
5. If you have the [Daily Scale Plan](https://www.daily.co/pricing) set the `DAILY_SCALE_PLAN` variable to `true` in
   order to use features like video recording.

## License

Distributed under the AGPLv3 License. See `LICENSE` for more information.
