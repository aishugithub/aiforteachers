/**
 * Exam timetable -> Google Calendar.
 *
 * Sheet layout (row 1 = headings, one exam per row):
 *   Date | Start | End | Class | Subject | Room | Status
 * Every exam goes into a calendar called "Term 1 Exams" (made if missing), with a
 * reminder the day before. Rows already marked "Added" are skipped, so it is safe
 * to run again after adding more exams.
 *
 * Use: Extensions > Apps Script, paste this, Save, then Run "addExamsToCalendar".
 * After the first run there is also an "Exams" menu in the Sheet.
 */

var CALENDAR_NAME = 'Term 1 Exams';
var REMIND_MINUTES_BEFORE = 24 * 60;   // one day

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Exams')
    .addItem('Add exams to Calendar', 'addExamsToCalendar')
    .addToUi();
}

function addExamsToCalendar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();          // dates as real dates
  var shown = range.getDisplayValues();    // times as typed, e.g. 09:30
  var tz = ss.getSpreadsheetTimeZone();

  var cal = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0] || CalendarApp.createCalendar(CALENDAR_NAME);
  var added = 0;

  for (var i = 1; i < values.length; i++) {
    var r = values[i], s = shown[i];
    if (!r[0] || String(r[6]).indexOf('Added') === 0) continue;   // empty or done

    var day = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : toIsoDate_(s[0], i);
    var start = Utilities.parseDate(day + ' ' + toTime_(s[1], i), tz, 'yyyy-MM-dd HH:mm');
    var end = Utilities.parseDate(day + ' ' + toTime_(s[2], i), tz, 'yyyy-MM-dd HH:mm');

    var event = cal.createEvent(r[3] + ' ' + r[4] + ' exam', start, end, {
      location: String(r[5]),
      description: 'Class ' + r[3] + ' · ' + r[4] + ' · Room ' + r[5]
    });
    event.removeAllReminders();
    event.addPopupReminder(REMIND_MINUTES_BEFORE);

    sheet.getRange(i + 1, 7).setValue('Added ✓');
    added++;
  }
  ss.toast(added + ' exam(s) added to the "' + CALENDAR_NAME + '" calendar.', 'Exams', 10);
}

/** "9:30", "09:30:00" or "2:00 PM" -> "HH:mm". */
function toTime_(text, i) {
  var m = /(\d{1,2})[:.](\d{2})(?::\d{2})?\s*([ap])?/i.exec(text);
  if (!m) throw new Error('Row ' + (i + 1) + ': the time "' + text + '" is not like 09:30.');
  var h = parseInt(m[1], 10);
  if (m[3] && /p/i.test(m[3]) && h < 12) h += 12;
  if (m[3] && /a/i.test(m[3]) && h === 12) h = 0;
  return (h < 10 ? '0' : '') + h + ':' + m[2];
}

/** A date typed as text: 2026-11-16 or 16/11/2026 (day first, as in India). */
function toIsoDate_(text, i) {
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text) || /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(text);
  if (!m) throw new Error('Row ' + (i + 1) + ': the date "' + text + '" is not like 2026-11-16.');
  var y = m[1].length === 4 ? m[1] : m[3], mo = m[2], d = m[1].length === 4 ? m[3] : m[1];
  return y + '-' + ('0' + mo).slice(-2) + '-' + ('0' + d).slice(-2);
}
