# **Angular Firebase Application - Ng-Shift**

**Github Repo:** [https://github.com/calyn05/ng-shift]

This is a sample Angular application made from two parts, user and admin, that utilizes Firebase for both the frontend and backend functionality. The frontend is built using Angular, while the backend uses Firebase Admin SDK to interact with some of the Firebase services.

This is the final project from my Frontend Web Develpoment course at NewTech Romania, and because the project requirements were to use Angular and Firebase and some parts of the admin side requires some strong privileges, I decided to build a small backend using Firebase Admin SDK.

The backend side is a simple Node.js server that uses Express.js to handle the routes and Firebase Admin SDK to interact with Firebase services. The backend is located in a different repo and it is deployed on **Render**. You can find the repo here: [https://github.com/calyn05/ng-shift-backend]

The application is a simple web app where users can track their shifts and earnings from different jobs and places, register and login, and admins can track users, update and delete users and their shifts. The application is deployed on Firebase Hosting and can be accessed at [https://ng-shift.calin.codes]

**Testing online application**

For testing purposes, I have created multiple users and an admin account. But you can easily `register your own account`.
It is important to note that the admin account is not a real admin account, it is just a regular user with a special role that allows him to access the admin side of the application and perform some privileged actions using the Firebase Admin SDK.

I implemented a code feature to register a new admin account, and one that is available for the moment is `admin7`. Soon I will implement an expire feature for the code and the admin account will be deleted for this code so that the admin account will be available for testing.

You can also use the below accounts to test the application.

**Testing Credentials**
You can use the following credentials to test the application:

**User**

# username: `willdoe`

# password: `12Saaa@`

**Admin**

# username: `admin1`

# password: `12Saaa@`

**Prerequisites**

Before you can run this application, ensure that you have the following installed:

Node.js (>=18.0.0)
Angular CLI (>=15.0.0)
Firebase CLI (>=11.0.0)
Firebase Admin SDK (>=11.0.0)

\*\*
Getting Started
Follow the steps below to get the application up and running:

**Clone the repository:**

`bash`
Copy code
`git clone https://github.com/calyn05/ng-shift`
`cd ng-shift`

Install the dependencies:

`bash`
Copy code
`npm install`

**Configure Firebase:**

Create a new Firebase project on the Firebase Console.
Enable necessary services (e.g., Authentication, Firestore, Hosting) in your project settings.
Generate a private key for the `Firebase Admin SDK` and save it as `serviceAccountKey.json` in the backend directory.

**Configure frontend environment:**

Rename the src/environments/environment.example.ts file to src/environments/environment.ts.
Update the Firebase configuration in the environment.ts file with your own project's details.

**Run the application:**

`bash`
Copy code
`ng serve`
`The application will be available at http://localhost:4200.`

**Backend Functionality**

Because the backend is deployed on `Render`, the API URL is already configured in the frontend environment. If you want to run the backend locally, follow the steps below. Also, it might be a little slow because it is deployed on a free plan and it goes to sleep after 1 hour of inactivity.

The backend of this application uses the Firebase Admin SDK to interact with some small parts of Firebase Auth services. It is located in the backend repo and provides the following functionality:

Authentication: Manages user authentication using Firebase Auth, changes user passwords, updates email addresses and deletes users.

To run the backend, follow these steps:

Install dependencies:

`bash`
Copy code
`cd ng-shift-backend`
`npm install`

Start the backend server:

`bash`
Copy code
`npm run start`
`The server will start running on http://localhost:8080.`

**Deploying the Application**
To deploy the application to Firebase hosting, follow these steps:

Build the production-ready frontend code:

`bash`
Copy code
`ng build`

Deploy to Firebase hosting:

`bash`
Copy code
`firebase deploy --only hosting:your-pproject-id`

The application will be deployed and accessible at the provided Firebase Hosting URL.

**Additional Resources**

For more information on how to use Angular and Firebase, refer to the following documentation:

**Angular Documentation**
**Firebase Documentation**
**Firebase Admin SDK Documentation**
