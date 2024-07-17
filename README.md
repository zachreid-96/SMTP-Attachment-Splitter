# SMTP-Attachment-Splitter

This project started off as a customer idea and suggestion that when using File Separation on a Copier and sending through SMTP that each file should be sent as an individual email. This is not natively supported by Copiers in the SMTP protocols. This is a simple script that aims to add that functionality with use of google scripts, triggers, and labels.

To implement this code into a Gmail SMTP server, or SMTP account:
  1) In Gmail > Settings > All Settings > Labels and Add 'Error', 'SMTP_mult', 'SMTP_single' (no need for filters)
  2) In Google Scrips > Create New Project > copy and paste 'Split_SMTP_Attachments.js' contents to project
  3) In Google Scripts Project > Triggers > Add Trigger >
     Function to use: myFunction
     Deployment: Head
     Event Source: Time-driven
     Time based trigger: Minutes timmer
     Minute Interval: Every Minute
     > Save

This script will then run every minute looking for new sent emails and will assign each email 'thread' a label so it is excluded in each subsequent search.
This script does log events, so if something is not acting the way it should there is a good chance it'll be logged.
This script does not handle non-SMTP sent emails, as those emails handle file attachment differently. If wanted, copying contents of 'all-emails.js' in place of lines 63-71 in 'SMTP-Attachment-Splitter.js' should do the trick.

This code has been tested and does work. But with the inevitability of updates some tweaking might be needed to get working again.
