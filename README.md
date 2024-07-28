# RSVP System with Google Form and Google Sheets

## Introduction
This project integrates Google Forms with Google Sheets to create an RSVP system for a spa. When a user fills out the embedded Google Form on your website, their responses are recorded in a Google Sheet, and a confirmation email is sent to both the user and the spa's customer service email. Additionally, a notification is sent to a designated Discord channel.

## Steps to Implement

1. **Set Up the Google Form and Link to Google Sheets:**
   - Create a Google Form with the necessary fields (e.g., customer name, email, service, appointment date, time, number of pax, special requests).
   - In Google Forms, navigate to the `Responses` tab and click on `Link to Sheets` to connect the form to a Google Sheet.

2. **Configure the Google Sheet and Script:**
   - Open the linked Google Sheet.
   - Go to `Extensions` > `Apps Script`.
   - Paste the provided `script.js` code into the Apps Script editor.
   - Update the following variables in the script:
     - `webhookUrl`
     - `bccEmail`
     - `locationLink`
     - `logoUrl`

3. **Install the Trigger:**
   - In the Apps Script editor, run the `installTrigger` function to set up the form submission trigger.
   - Authorize the script if prompted.

## Script Details

The `script.js` includes the following functionalities:

- **Discord Notification:**
  - Sends a notification to a Discord channel with the reservation details using a webhook.
  
- **Confirmation Email:**
  - Sends a well-formatted HTML confirmation email to both the user and the spa's customer service email.
  - Includes a link to the spa's location and an "Add to Google Calendar" link.

## Future Plans

- **Enhancements:**
  - Implement a system to check employee availability.
  - Automatically send reminder emails 2 days prior to the appointment date.

## Known Issues

- **Google Form Limitations:**
  - The date input in Google Forms does not provide a calendar interface for selection.

