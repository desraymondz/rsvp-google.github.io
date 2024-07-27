// Paste this code in the google sheet's extensions called "Appscript"
// Change 'YOUR_DISCORD_WEBHOOK_URL', 'yourspaemail@example.com' and "yourlogoURL"

/**
 * Function to handle form submission.
 * 
 * @param {Object} e - The event object containing form responses.
 */
function onFormSubmit(e) {
  try {
    // Define the Discord webhook URL
    var webhookUrl = "YOUR_DISCORD_WEBHOOK_URL";
    
    // Get the form responses
    var response = e.values;

    // Extract individual form fields
    var timeStamp = response[0];
    var customerEmail = response[1];
    var customerName = response[2];
    var service = response[3]; 
    var time = response[4]; // Time in local time zone (UTC +7)
    var appointmentDate = response[5];
    var numOfPax = response[6];
    var specialRequest = response[7];

    // Prepare the payload for the Discord notification
    var payload = {
      "content": "New spa reservation:\n\n" +
                 "Timestamp: " + timeStamp + "\n" +
                 "Email: " + customerEmail + "\n" +
                 "Name: " + customerName + "\n" +
                 "Service: " + service + "\n" +
                 "Time (local): " + time + "\n" +
                 "Appointment Date: " + appointmentDate + "\n" +
                 "Number of Pax: " + numOfPax + "\n" +
                 "Special Request: " + specialRequest
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };

    // Send the Discord notification
    UrlFetchApp.fetch(webhookUrl, options);

    // Prepare the email content in HTML format with CSS styling
    var logoUrl = "yourlogoURL"; // Direct link to your logo
    var emailSubject = "Spa Reservation Confirmation";
    var emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <img src="${logoUrl}" alt="Spa Logo" style="width: 200px; height: auto; margin-bottom: 20px;" />
        <p>Dear ${customerName},</p>
        <p>Thank you for your reservation. Here are the details:</p>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px; margin: auto;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Service</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${service}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Appointment Date</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${appointmentDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Time</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${time} (Local Time)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Number of Pax</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${numOfPax}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Special Request</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${specialRequest}</td>
          </tr>
        </table>
        <p>We look forward to serving you!</p>
        <p>Best regards,<br>Your Spa Team</p>
      </div>
    `;

    // Send the confirmation email with a BCC to the customer service email
    MailApp.sendEmail({
      to: customerEmail,
      bcc: 'yourspaemail@example.com', // Updated customer service email
      subject: emailSubject,
      htmlBody: emailBody
    });

  } catch (error) {
    Logger.log('Error: ' + error.message);
  }
}

/**
 * Function to install a trigger to automatically run onFormSubmit function when a form is submitted.
 */
function installTrigger() {
  // Remove existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "onFormSubmit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Install a new trigger
  ScriptApp.newTrigger("onFormSubmit")
           .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
           .onFormSubmit()
           .create();
}
