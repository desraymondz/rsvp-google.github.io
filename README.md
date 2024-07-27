# rsvp-google
 RSVP system with Google Form and Google Sheet

# Introduction
Google form is embedded to a website where when the user inputs their details and submit it, Google form will record the responses in a google sheet and send a confirmation email to the user and business's customer service email.

# Steps to Implement
Paste code `script.js` to the google sheet's extensions called `Appscript`
- Making Google Form, go to `Responses` and click `Link to Sheets`
- In Google Sheets, navigate to `Extensions` on the top and choose `App Script`
- Paste the `script.js` code in `App Script` and change the following:
  - 'YOUR_DISCORD_WEBHOOK_URL'
  - 'yourspaemail@example.com'
  - 'yourlogoURL'

# Future Plans
- Add durations in the form (60/90/120 mins)
- Check availability
- Auto send reminder 2 days prior to the appointment date
- Add to Google Calendar Feature in email
