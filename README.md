# MussHaben

**The advanced willhaben search agent.**

This project is a PWA web application that allows users to create search agents for specific product categories on the Willhaben website.
Unlike the existing built-in search agent, this application notifies users of new products only in a matter of minutes instead of hours.

## Problem

The existing built-in search agent on the Willhaben website is not efficient in notifying users of new products. It can take hours for users to receive notifications about new products that match their search criteria, which can lead to missed opportunities and frustration.

## Disclaimer

This project was created for educational purposes only and is not intended for commercial use. Use this application at your own risk and be aware of the potential consequences.

## Restrictions

The project was built as a hobby project and is not intended for commercial use.
For this reason, I have implemented at maximum of search agents per user.
This is to prevent abuse of the application and to ensure that it remains a fun and educational project for everyone.

### Changing Maximum Search Agents

To change the maximum number of search agents per user, you can modify the `MAX_SEARCH_AGENTS_WITHOUT_PREMIUM` config constant in `src/config/maximumAgents.ts`.
Additionally the firstore rules need to be updated to reflect the new maximum number of search agents per user. The rules can be found in `firestore.rules`.

## Development

### Start-Up

To start the development environment, we need to start:
- the firebase emulator's: `firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data`
- the react vite frontend: `cd frontend && npm run dev`

### Deployment

#### Frontend

The frontend is deployed on firebase hosting automatically on every push to the main branch. Alternatively, you can deploy the frontend to firebase hosting by running `firebase deploy --only hosting` from the root of the project.

#### Backend

To deploy the application to firebase run `firebase deploy --only "firestore,functions,auth"` from the root of the project.
