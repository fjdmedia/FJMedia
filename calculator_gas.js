/**
 * FJMedia — Calculator Quote Leads
 *
 * Paste this into Google Apps Script (Extensions → Apps Script)
 * from inside your FJMedia Google Sheet.
 *
 * Creates/uses a sheet tab called "Calculator Leads"
 * Logs: Timestamp | Name | Contact | Services | Combo Match
 * Sends email notification to diazfjamesc@gmail.com
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name     = data.name     || '';
    var contact  = data.contact  || '';
    var services = data.services || '';
    var combo    = data.combo    || '';

    // Get or create the "Calculator Leads" tab
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Calculator Leads');
    if (!sheet) {
      sheet = ss.insertSheet('Calculator Leads');
      sheet.appendRow(['Timestamp', 'Name', 'Contact', 'Services', 'Combo Match']);
      // Bold header row
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    // Log the lead
    var timestamp = new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' });
    sheet.appendRow([timestamp, name, contact, services, combo]);

    // Email notification
    var subject = '🔔 New Quote Request — ' + name;
    var body = 'New calculator lead from fjmedia.ca\n\n'
      + 'Name: ' + name + '\n'
      + 'Contact: ' + contact + '\n'
      + 'Services: ' + services + '\n'
      + 'Combo Match: ' + combo + '\n'
      + 'Time: ' + timestamp;

    MailApp.sendEmail('diazfjamesc@gmail.com', subject, body);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
