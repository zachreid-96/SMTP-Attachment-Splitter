if (attachments.length == 0) {
  var tempAttachments = message.getPlainBody().split('\n')
  for (var a=0; a<tempAttachments.length; a++) {
    if (tempAttachments[a].includes("<")) {
      var attachment = tempAttachments[a];
      GmailApp.sendEmail(recipients,
                        subject,
                        body,
                        {attachments: [attachment.getAs(MimeType.PDF)]});
      Logger.log("Sent non-SMTP attachment found via .getPlainBody()");
    }
  }
} else if (attachments.length > 1) {
  for (var a=0; a<attachments.length; a++) {
    var attachment = attachments[a];
      GmailApp.sendEmail(recipients,
                        subject,
                        body,
                        {attachments: [attachment.getAs(MimeType.PDF)]});
    Logger.log("Sent " + attachment.getName() + " to " + recipients.join(', '));
  }
}
