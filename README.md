# Interactive-Plant-Care-Assistant

## Project Description

The **Interactive Plant Care Assistant** is a web application that helps plant owners manage their plants effectively. The system provides **plant identification**, **health diagnosis**, **weather-based care suggestions**, and **personalized reminders**. It integrates external APIs like **Plant.id**, **Weather API**, **Chat API**, and **Google Calendar API** to automate plant care routines.

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

#### 4. Start the frontend server

```bash
cd frontend
npm install
npm start
```

#### 5. Start the backend server (in separate terminal)

```bash
cd backend
npm install
npm run dev
```

---

## Plant Identification using Plant.id API

### 1. Obtain a Plant.id API Key

To enable plant identification features, follow these steps to obtain your API key:

1. Go to the [Plant.id website](https://web.plant.id/plant-identification-api/).
2. Sign up for a free or paid account.
3. Navigate to the **Dashboard** after logging in.
4. Under the **API Keys** section, create a new key if one doesn't already exist.
5. Copy the key for use in your backend environment.

### 2. Configure `.env` File

Add the following line to your `.env` file located in the **backend** directory:

```ini
PLANT_ID_API_KEY=your-plant-id-api-key
PORT=5000
```

### 3. Identify a Plant via Backend Endpoint

- **Endpoint:** `POST /api/plant/identify`
- **Request:** Form-data with the image file under the key `image`
- **Response:** JSON containing plant name, probability of match, and related image suggestions.

#### Example Terminal Command

To test the plant identification system, run the following commands from the **backend** directory in seperate terminals:

```bash
npm run dev
curl -X POST -F "image=@uploads/rose.jpg" http://localhost:5000/api/plant/identify
```

#### Example Response

```json
{
  "message": "Plant identified successfully",
  "data": {
    "suggestions": [
      {
        "id": "123456789",
        "name": "Ficus lyrata",
        "probability": 0.85,
        "similar_images": [
          "https://plant-id.cdn/ficus-image1.jpeg"
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
5. Sign up and generate a **Hugging Face API Key**.
6. Copy the API key for later use.

### 2. Configure `.env` File

Create or update the `.env` file in the **backend** directory:

```ini
WEATHER_API_KEY=your-weather-api-key
HG_API_KEY=your_hugging_face_api_key
```

### 3. Running the Weather API Demo

To test the weather-based plant care system, run the following commands from the **backend** directory in seperate terminals:

```bash
npm run dev
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
   npm run dev
   ```

---
