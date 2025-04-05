# Interactive-Plant-Care-Assistant

## Project Description

The **Interactive Plant Care Assistant** is a web application that helps plant owners manage their plants effectively. The system provides **plant identification**, **health diagnosis**, **weather-based care suggestions**, and **personalized reminders**. It integrates external APIs like **Plant.id**, **Weather API**, **GPT API**, and **Google Calendar API** to automate plant care routines.

This module contains the implementation of reminding users to take care of their plants. Here, we use the **Google Calendar API** to set reminders in the user's Google Calendar.

---

## Setup and Installation

### Prerequisites

- **Node.js** installed (Recommended version: `>= v18`)
- **NPM** installed (`>= v10`)
- **Google API Credentials** (for Calendar integration)
- **Plant.id API Key** (for plant identification)
- **Weather API Key** (for weather-based care suggestions)

### Step-by-Step Installation

#### 1. Clone the repository

```bash
git clone https://github.com/PVSekhar1234/Interactive-Plant-Care-Assistant.git
cd Interactive-Plant-Care-Assistant
```

#### 2. Initialize the project

```bash
npm init -y
```

#### 3. Install backend dependencies

```bash
npm install path body-parser express-session googleapis dotenv express ejs axios multer cors firebase-admin
```

#### 5. Start the frontend server

```bash
npm start
```

#### 6. Start the backend server 

```bash
cd backend
npm install
nodemon src/server.js
```

---

## Plant Identification using Plant.id API

### 1. Obtain Plant.id API Key

To use the **Plant.id API**, follow these steps:

1. Go to [Plant.id API](https://plant.id/)
2. Sign up for an account.
3. Navigate to the **API Dashboard**.
4. Generate an API key under the **API Credentials** section.
5. Copy the API key for later use.

### 2. Set Up Environment Variables

Create a `.env` file in the **backend** directory and add the following:

```ini
PLANT_ID_API_KEY=your-plant-id-api-key
PORT=5000
```

### 3. API Endpoint for Plant Identification

#### **Upload and Identify a Plant Image**

- **Endpoint:** `POST /api/plant/identify`
- **Request:**
  - `image`: Image file (uploaded using `multipart/form-data`)
- **Response:** JSON object with plant name, probability, and image suggestions.

#### **Terminal Command to Test API**

```bash
curl -X POST -F "image=@backend/uploads/rose.jpg" http://localhost:5000/api/plant/identify
```

#### **Example Response**

```json
{
  "message": "Plant identified successfully",
  "data": {
    "suggestions": [
      {
        "id": "02550314fb506af1",
        "name": "Rosa chinensis",
        "probability": 0.42,
        "similar_images": [
          "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/4/20a/4e51faf0387cc5685c1fa06bce7540ac4ddb0.jpeg"
        ]
      }
    ]
  }
}
```

---

## Weather-Based Care Suggestions

### 1. Obtain a Weather API Key

To enable weather-based plant care recommendations:

1. Go to [Weather API Provider](https://openweathermap.org/api).
2. Sign up and generate an **API Key**.
3. Copy the API key for later use.
4. Go to https://huggingface.co/
5. Sign up and generate and **API Key**.
6. Copy the API key for later use.

### 2. Configure `.env` File

Create or update the `.env` file in the **backend** directory:

```ini
WEATHER_API_KEY=your-weather-api-key
HG_API_KEY=your_hugging_face_api_key
```

### 3. Running the Weather API Demo

To test the weather-based plant care system, run the following command from the **backend** directory:

```bash
node ./src/api/weather.js
```

---

## Firebase Setup

### 1. Create a project in Firebase and register the application.

1. Obtain Firebase config from Project Settings.
2. Enable Email/Password and Google as the authentication providers. `(Firebase Console -> Your Project -> Authentication -> Sign-in Methods)`
3. Set the Action URL in Templates as `http://localhost:3000/verify`. `(Firebase Console -> Your Project -> Authentication -> Templates)`

### 2. Configure `.env` File

Add these in the  `.env` file in the **backend** directory:

```ini
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---



## Google Calendar Reminder Setup

### 1. Get Google API Credentials

Obtain credentials from **Google Cloud Console**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project.
3. Enable the **Google Calendar API**.
4. Generate OAuth 2.0 credentials.
5. Set the redirect URL as `http://localhost:5000/api/calendar/oauth2callback`
6. Download the credentials JSON file.
7. Extract **Client ID**, **Client Secret**, and **Redirect URI**.

### 2. Configure `.env` File

Create a `.env` file in the **backend** directory:

```ini
CLIENT_ID=your-google-api-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=your-redirect-url
SESSION_SECRET=your-generated-session-secret-key
```

### 3. Set a Calendar Reminder

Once reminders are set, users will receive notifications in their **Google Calendar** at scheduled times.

---
## Running the Application

1. **Start frontend server:**
   ```bash
   cd frontend
   npm start
   ```
2. **Start backend server:**
   ```bash
   cd backend
   nodemon src/server.js
   ```
3. **Test Plant ID API:**
   ```bash
   curl -X POST -F "image=@backend/uploads/rose.jpg" http://localhost:5000/api/plant/identify
   ```
4. **Run Weather API Demo:**
   ```bash
   node ./src/api/weather.js
   ```

---
