# Interactive-Plant-Care-Assistant
Project Description

The Interactive Plant Care Assistant is a web application that helps plant owners manage their plants effectively. The system provides plant identification, health diagnosis, weather-based care suggestions, and personalized reminders. It integrates external APIs like Plant.id, Weather API, GPT API, and Google Calendar API to automate plant care routines.

This module contains the implementation of reminding the users to take of their plants.Here, we used Google calendar API to set reminders in user's google calendar.

Get your own credentials from Google cloud console.

Make a config folder in the root directory and inside it make a 'dev.env' file like as config(folder) -> dev.env(file) .The config file must contain 3 env variables as
CLIENT_ID=your google api client id
CLIENT_SECRET=your google client secret
REDIRECT_URI=your redirect url

Installations:-
1. npm install  path body-parser express-session googleapis dotenv
2. npm install express-session
3. npm install react-scripts

To run front-end:-
1. Clone the repository

2. Navigate to the frontend folder
   cd frontend
3. Install the required frontend dependencies
   npm install react-scripts
4. Start the frontend server
   npm start

To run backend :-
1. Navigate to the backend folder
   cd backend
   npm init -y
2. Install the required backend dependencies
     npm i express ejs
3. Start the backend server
    npm start

Output:-
Once the reminder is set, you will receive notifications in your Google Calendar at the scheduled times.



