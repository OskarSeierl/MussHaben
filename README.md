# Willhaben Advanced Search Agent

This project is a PWA web application that allows users to create search agents for specific product categories on the Willhaben website.
Unlike the existing built-in search agent, this application notifies users of new products only in a matter of minutes instead of hours.

## Problem

The existing built-in search agent on the Willhaben website is not efficient in notifying users of new products. It can take hours for users to receive notifications about new products that match their search criteria, which can lead to missed opportunities and frustration.

## Development

### Start-Up

To start the development environment, we need to start:
- the firebase emulator's: `firebase emulators:start`
- the react vite frontend: `cd frontend && npm run dev`

### Deployment

To deploy the application to firebase, either
- run `firebase deploy` from the root of the project, or
- push the code to the `main` branch, which will trigger the GitHub Action to deploy the application to firebase.
