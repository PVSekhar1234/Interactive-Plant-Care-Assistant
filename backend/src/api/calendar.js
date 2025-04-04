
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(express.static(path.join(__dirname, 'public')))
require('dotenv').config();
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
const router = express.Router();

// Ensure session middleware is applied to the router
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

router.get('/', (req, res) =>{
  res.render('index.html');
})
router.get('/auth', (req, res) => {
    // Store event details in session (if user was trying to add an event before auth)
    req.session.eventData = req.query;

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
        prompt: 'consent',
        redirect_uri: process.env.REDIRECT_URI, // Ensure it redirects to /oauth2callback
    });
    
    res.redirect(authUrl); // Redirect to Google OAuth page
});

// Handle OAuth Callback
router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
     
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        req.session.tokens = tokens; // Store tokens in session
        console.log("OAuth Tokens:", tokens);
        
        // Redirect user back to event creation page after authentication
        if (req.session.eventData) {
            const query = new URLSearchParams(req.session.eventData).toString();
            delete req.session.eventData;
            return res.redirect(`/api/calendar/create-event?${query}`);
        }

        res.redirect('/'); // Redirect to home if no event data was stored
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Event Creation (After Authentication)
router.get('/create-event', async (req, res) => {
    if (!req.session.tokens) {
        return res.redirect('/auth'); // Redirect to authenticate if tokens are missing
    }

    // Extract event details from query params
    const { date, startTime, endTime, title, description } = req.query;

    oAuth2Client.setCredentials(req.session.tokens);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const eventStartTime = new Date(`${date}T${startTime}:00`);
    const eventEndTime = new Date(`${date}T${endTime}:00`);

    const event = {
        summary: title,
        description: description,
        colorId: 2,
        start: { dateTime: eventStartTime.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: eventEndTime.toISOString(), timeZone: 'Asia/Kolkata' },
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 10 }] },
    };

    try {
        await calendar.events.insert({ calendarId: 'primary', resource: event });
        res.send('Event added to your calendar!');
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).send('Failed to add event');
    }
});
// Check if the user is authenticated
router.get('/check-auth', (req, res) => {
    if (req.session.tokens) {
        console.log("User is authenticated:", req.session.tokens);
        res.json({ isAuthenticated: true });
    } else {
        console.log("User is not authenticated");
        res.json({ isAuthenticated: false });
    }
});

// router.get('/auth', (req, res) => {
//     const query = req.query;
//     req.session.eventData = query; // Store event data in session

//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: ['https://www.googleapis.com/auth/calendar.events'],
//         prompt: 'consent',
//         redirect_uri: process.env.REDIRECT_URI,
//     });

//     res.redirect(authUrl);
// });

// router.get('/oauth2callback', async (req, res) => {
//     const code = req.query.code;
//     try {
//         const { tokens } = await oAuth2Client.getToken(code); // Get tokens
//         req.session.tokens = tokens; // Store tokens in session
//         console.log("Tokens**********************:", tokens);
//         const query = new URLSearchParams(req.session.eventData).toString();
//         delete req.session.eventData; // Clear event data after use

//         res.redirect(`/api/calendar/events?${query}`);
//     } catch (error) {
//         console.error('Error getting tokens:', error);
//         res.status(500).send('Authentication failed');
//     }
// });

  

// router.post('/events', async (req, res) => {
//     const { date, startTime, endTime, title, description } = req.body;
//     console.log("in events !!!!")
//     // If tokens are not available, redirect to /auth with event data
//     console.log("Session Data**********************:", req.session);
//     if (!req.session.tokens) {
//         const query = new URLSearchParams({
//             date,
//             startTime,
//             endTime,
//             title,
//             description
//         }).toString();
//          console.log("redirecting to auth");
//          return res.redirect(`/api/calendar/auth?${query}`);
//     }

//     // If tokens are available, directly create the event
//     await createEvent(req, res);
// });

// async function createEvent(req, res) {
//     const { date, startTime, endTime, title, description } = req.query;

//     oAuth2Client.setCredentials(req.session.tokens);
//     const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

//     const eventStartTime = new Date(`${date}T${startTime}:00`);
//     const eventEndTime = new Date(`${date}T${endTime}:00`);

//     const event = {
//         title,
//         description,
//         colorId: 2,
//         start: { dateTime: eventStartTime.toISOString(), timeZone: 'Asia/Kolkata' },
//         end: { dateTime: eventEndTime.toISOString(), timeZone: 'Asia/Kolkata' },
//         reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 10 }] },
//     };

//     try {
//         await calendar.events.insert({ calendarId: 'primary', resource: event });
//         res.send('Event added to your calendar!');
//     } catch (err) {
//         console.error('Error creating event:', err);
//         res.status(500).send('Failed to add event');
//     }
// }

// router.get('/events', createEvent); 

module.exports = router;