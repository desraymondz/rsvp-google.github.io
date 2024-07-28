function onFormSubmit(e) {
  try {
    var webhookUrl = "https://discord.com/api/webhooks/1266762256863985839/fv7VYqYGWEmaknGYtMDDSaneA2hbFYUI1HvBNJbh8FsJI6Ik06cHUQ5BnSlYstE3OSY8"; // Discord webhook URL
    var locationLink = "https://maps.app.goo.gl/udsDR5MxNq9NcEEW7"; // Spa location link
    var bccEmail = "spavaliddev@gmail.com"; // Customer service email
    var logoUrl = "https://drive.google.com/uc?export=view&id=1U0xXiveviIMK6p3hRKrKlYuiRgK0x1OW"; // Spa logo URL
    var response = e.values; // Get the form responses

    // Log the form response for debugging
    Logger.log('Form Response: ' + JSON.stringify(response));

    var timeStamp = response[0];
    var customerEmail = response[1];
    var customerName = response[2];
    var service = response[3]; 
    var duration = parseInt(response[4].split(' ')[0]); // Extract duration in minutes
    var time = response[5]; // Time in local time zone (UTC +7)
    var appointmentDate = response[6]; // Date in MM/DD format
    var numOfPax = response[7];
    var specialRequest = response[8];

    // Parse the appointment date (MM/DD) and construct a Date object
    var [month, day] = appointmentDate.split('/');
    var year = new Date().getFullYear(); // Use the current year
    var parsedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // Create date object in UTC

    // Set the local time (UTC+7)
    var [hours, minutes] = time.split(':');
    parsedDate.setUTCHours(hours - 7); // Adjust hours to UTC
    parsedDate.setUTCMinutes(minutes);

    var startDateTime = new Date(parsedDate.getTime()); // Local time (UTC+7) as the start time
    var endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000); // Calculate end time based on duration

    // Prepare the payload for the Discord notification
    var payload = {
      "content": "New spa reservation:\n\n" +
                 "Timestamp: " + timeStamp + "\n" +
                 "Email: " + customerEmail + "\n" +
                 "Name: " + customerName + "\n" +
                 "Service: " + service + "\n" +
                 "Time (local): " + time + "\n" +
                 "Duration: " + duration + " Minutes\n" + // Add duration
                 "Appointment Date: " + appointmentDate + "\n" +
                 "Number of Pax: " + numOfPax + "\n" +
                 "Special Request: " + specialRequest
    };

    // Log the Discord payload for debugging
    Logger.log('Discord Payload: ' + JSON.stringify(payload));

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };

    // Send the Discord notification
    UrlFetchApp.fetch(webhookUrl, options);
    Logger.log('Discord notification sent successfully.');

    // Generate Google Calendar link with explicit local time and details in description
    var startDateTimeLocal = startDateTime.toISOString().replace(/-|:|\.\d+Z$/g, "").replace('T', 'T') + 'Z';
    var endDateTimeLocal = endDateTime.toISOString().replace(/-|:|\.\d+Z$/g, "").replace('T', 'T') + 'Z';
    var calendarDescription = `Service: ${service}%0AAppointment Date: ${appointmentDate}%0ATime: ${time} (Local Time)%0ADuration: ${duration} Minutes%0ANumber of Pax: ${numOfPax}%0ASpecial Request: ${specialRequest}`;
    var calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Spa%20Appointment&dates=${startDateTimeLocal}/${endDateTimeLocal}&details=${calendarDescription}&location=${encodeURIComponent(locationLink)}&ctz=Asia/Bangkok`;

    // Prepare the email content in HTML format with CSS styling
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
            <td style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;"><strong>Duration</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${duration} Minutes</td>
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
        <p><a href="${locationLink}" target="_blank" style="color: #1a73e8; text-decoration: none;">Our Spa Location</a></p>
        <p><a href="${calendarLink}" target="_blank" style="color: #1a73e8; text-decoration: none;">Add to Google Calendar</a></p>
        <p>Best regards,<br>Your Spa Team</p>
      </div>
    `;

    // Send the confirmation email with a BCC to the customer service email
    MailApp.sendEmail({
      to: customerEmail,
      bcc: bccEmail, // Customer service email
      subject: emailSubject,
      htmlBody: emailBody
    });

    Logger.log('Confirmation email sent successfully.');

  } catch (error) {
    Logger.log('Error: ' + error.message);
  }
}

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
