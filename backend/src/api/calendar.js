
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

const router = express.Router();

const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

router.get('/', (req, res) =>{
  res.render('index.html');
})

router.get('/auth', (req, res) => {
    const query = req.query;
    req.session.eventData = query; // Store event data in session

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
        prompt: 'consent',
    });

    res.redirect(authUrl);
});

router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code); // Get tokens
        req.session.tokens = tokens; // Store tokens in session

        const query = new URLSearchParams(req.session.eventData).toString();
        delete req.session.eventData; // Clear event data after use

        res.redirect(`/events?${query}`);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

  

router.post('/events', async (req, res) => {
    const { date, startTime, endTime, summary, description } = req.body;

    // If tokens are not available, redirect to /auth with event data
    if (!req.session.tokens) {
        const query = new URLSearchParams({
            date,
            startTime,
            endTime,
            summary,
            description
        }).toString();

        return res.redirect(`/auth?${query}`);
    }

    // If tokens are available, directly create the event
    await createEvent(req, res);
});

async function createEvent(req, res) {
    const { date, startTime, endTime, summary, description } = req.query;

    oAuth2Client.setCredentials(req.session.tokens);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const eventStartTime = new Date(`${date}T${startTime}:00`);
    const eventEndTime = new Date(`${date}T${endTime}:00`);

    const event = {
        summary,
        description,
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
}

router.get('/events', createEvent); 

module.exports = router;