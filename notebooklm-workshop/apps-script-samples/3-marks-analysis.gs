/**
 * Unit-test marks analysis.
 *
 * Sheet layout (row 1 = headings): Roll No | Subject 1 | Subject 2 | ...
 * Marks out of 100. Any number of subjects. Use roll numbers, not names.
 * Makes a "Summary" tab: average, highest, lowest and pass % per subject, who is
 * below the pass mark in each subject, a remedial list (below the pass mark in
 * two or more subjects) and a chart. Marks below the pass mark turn pink.
 *
 * Use: Extensions > Apps Script, paste this, Save, then Run "analyseMarks".
 * After the first run there is also a "Marks" menu in the Sheet.
 */

var PASS_MARK = 35;

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Marks')
    .addItem('Analyse marks', 'analyseMarks')
    .addToUi();
}

function analyseMarks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  if (sheet.getName() === 'Summary') throw new Error('Click the marks tab first, then run again.');

  var values = sheet.getDataRange().getValues();
  var subjects = values[0].slice(1);
  var students = values.slice(1).filter(function (r) { return r[0] !== ''; });
  if (!students.length) throw new Error('No marks found. Put headings in row 1: Roll No, then one column per subject.');

  // Per-subject statistics, and who is below the pass mark.
  var stats = [['Subject', 'Average', 'Highest', 'Lowest', 'Pass %', 'Below ' + PASS_MARK + ' (roll numbers)']];
  var fails = {};   // roll number -> subjects below the pass mark
  subjects.forEach(function (subject, s) {
    var marks = [], below = [];
    students.forEach(function (r) {
      var m = r[s + 1];
      if (typeof m !== 'number') return;   // absent or blank
      marks.push(m);
      if (m < PASS_MARK) {
        below.push(r[0]);
        (fails[r[0]] = fails[r[0]] || []).push(subject);
      }
    });
    var sum = marks.reduce(function (a, b) { return a + b; }, 0);
    stats.push([subject,
      marks.length ? Math.round(sum / marks.length * 10) / 10 : '',
      marks.length ? Math.max.apply(null, marks) : '',
      marks.length ? Math.min.apply(null, marks) : '',
      marks.length ? Math.round((marks.length - below.length) / marks.length * 100) + '%' : '',
      below.join(', ') || 'None']);
  });

  var remedial = [['Roll No', 'Subjects below ' + PASS_MARK]];
  Object.keys(fails).forEach(function (roll) {
    if (fails[roll].length >= 2) remedial.push([roll, fails[roll].join(', ')]);
  });
  if (remedial.length === 1) remedial.push(['None', '']);

  // Write the Summary tab from scratch each time.
  var out = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  out.clear();
  out.getCharts().forEach(function (c) { out.removeChart(c); });
  out.getRange(1, 1).setValue('Marks summary · ' + students.length + ' students · pass mark ' + PASS_MARK)
    .setFontSize(14).setFontWeight('bold');
  out.getRange(3, 1, stats.length, stats[0].length).setValues(stats);
  out.getRange(3, 1, 1, stats[0].length).setFontWeight('bold').setBackground('#E3EBFD');

  var rRow = stats.length + 5;
  out.getRange(rRow - 1, 1).setValue('Remedial group: below the pass mark in two or more subjects').setFontWeight('bold');
  out.getRange(rRow, 1, remedial.length, 2).setValues(remedial);
  out.getRange(rRow, 1, 1, 2).setFontWeight('bold').setBackground('#FDE2E6');
  out.autoResizeColumns(1, stats[0].length);

  out.insertChart(out.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(out.getRange(3, 1, stats.length, 2))
    .setPosition(3, 8, 0, 0)
    .setOption('title', 'Class average by subject')
    .setOption('legend', { position: 'none' })
    .setOption('vAxis', { minValue: 0, maxValue: 100 })
    .build());

  // Pink background on every mark below the pass mark in the marks tab.
  var markRange = sheet.getRange(2, 2, values.length - 1, subjects.length);
  var colours = markRange.getValues().map(function (row) {
    return row.map(function (m) { return typeof m === 'number' && m < PASS_MARK ? '#FDE2E6' : null; });
  });
  markRange.setBackgrounds(colours);

  ss.toast('Summary ready: ' + (remedial[1][0] === 'None' ? 0 : remedial.length - 1) + ' student(s) in the remedial group.', 'Marks', 10);
}
