# Running functions locally

You can run functions locally to test them before deploying to production.

### Prerequisites
Install the [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) and [Node.js](https://nodejs.org/en/download/).

### Setup
Run the following command to install dependencies:
```bash
npm install
```

### Running the emulator
Run the following command to start the emulator:
```bash
npm run serve
```

### Testing the function with Firestore emulator
1. Initialize the Firestore emulator:
```bash
firebase init emulators
```
2. Select the Firestore emulator.
3. Run the following command to start the emulator:
```bash
firebase emulators:start
```

### Deploying the function
Run the following command to deploy the function:
```bash
npm run deploy
```
