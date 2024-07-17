/*
  A more concise version of Split SMTP
  This will search the sent box for emails
  Any with multiple attachments will be resent as individual emails
*/

function myFunction() {
  
  // Stores 'SMTP' label for use later and for exluding in search
  // searches sent box for any sent email without labels
  var label_SMTP_Mult = GmailApp.getUserLabelByName('SMTP_mult');
  var label_SMTP_Single = GmailApp.getUserLabelByName('SMTP_single');
  var label_Error = GmailApp.getUserLabelByName('Error');
  var threads = GmailApp.search('in:sent has:nouserlabels')

  // if no threads are found, returns
  // Logs event, unneccessary
  if (threads.length == 0) { 
    Logger.log("No threads found.")
    return; 
  }

  // loops through threads and loops through messages within
  for (var t=0; t<threads.length; t++) {
    var thread = threads[t];
    var messages = thread.getMessages();

    // if no message is found, returns
    // Logs event for debugging
    if (messages.length == 0) {
      Logger.log("No messages found within thread. " + thread.getLastMessageDate());
      Logger.log('Thread moved to label:Error');
      labelHandler(thread, label_Error);
      return;
    }

    // loops through messages within thread
    for (var m=0; m<messages.length; m++) {
      var message = messages[m];

      // gets recipients and stores in array
      var recipients = message.getTo().split(',').concat(
          message.getCc().split(','),
          message.getBcc().split(',')).filter(Boolean);
      
      // if no recipients for some reason, continues
      // Logs event in weird occurance for debugging
      if (recipients.length == 0) { 
        Logger.log("No recipients found. " + message.getDate());
        Logger.log('Thread moved to label:Error');
        labelHandler(thread, label_Error);
        continue; 
      }

      // stores attachments in array, stores body/subject for use later
      var attachments = message.getAttachments();
      var body = message.getBody();
      var subject = message.getSubject();

      // loops through attachments in there are 2 or more
      // sends each attachment as individual email with copied over body/subject
      // Logs what was sent and to whom for debugging purpose
      if (attachments.length > 1) {
        for (var a=0; a<attachments.length; a++) {
          var attachment = attachments[a];
          GmailApp.sendEmail(recipients,
                  subject,
                  body,
                  {attachments: [attachment.getAs(MimeType.PDF)]});
          Logger.log("Sent " + attachment.getName() + " to " + recipients.join(', '));
        }
      } else {
        // Logs event of move to label:SMTP_single
        // excludes in subsequent searches
        Logger.log("Thread moved to label:SMTP_single");
        thread.addLabel(label_SMTP_Single);
        continue;
      }
    }
    // Adds label 'SMTP_mult' to thread to exclude in next search
    thread.addLabel(label_SMTP_Mult);
  }
}

// Adds passed label (l) to passed thread (t)
function labelHandler(t, l) {
  t.addLabel(l);
}
