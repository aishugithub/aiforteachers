/**
 * The mark list as a web page.
 *
 * Uses the same Sheet as the marks analysis sample:
 *   Roll No | Subject 1 | Subject 2 | ...   (marks out of 100, roll numbers only)
 * The page shows every mark (below the pass mark in pink), each student's total and
 * percentage, the class average per subject and a search box for a roll number.
 * It reads the Sheet each time it opens, so a refresh shows the latest marks.
 *
 * Use: Extensions > Apps Script, paste this, Save. Then Deploy > New deployment >
 * Web app. Execute as: Me. Who has access: Only myself, or your school only.
 * Never "Anyone": this page shows marks.
 */

var PAGE_PASS_MARK = 35;
var PAGE_TITLE = 'Class 9A · Unit Test 1 marks';

function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets().filter(function (s) { return s.getName() !== 'Summary'; })[0];
  var values = sheet.getDataRange().getValues();
  var subjects = values[0].slice(1);
  var students = values.slice(1).filter(function (r) { return r[0] !== ''; });

  var rows = students.map(function (r) {
    var marks = r.slice(1), total = 0, count = 0;
    var cells = marks.map(function (m) {
      if (typeof m !== 'number') return '<td class="ab">' + esc_(m || '-') + '</td>';
      total += m; count++;
      return '<td' + (m < PAGE_PASS_MARK ? ' class="low"' : '') + '>' + m + '</td>';
    }).join('');
    var pct = count ? Math.round(total / count) + '%' : '-';
    return '<tr><th scope="row">' + esc_(r[0]) + '</th>' + cells + '<td class="t">' + total + '</td><td class="t">' + pct + '</td></tr>';
  }).join('');

  var averages = subjects.map(function (s, k) {
    var marks = students.map(function (r) { return r[k + 1]; }).filter(function (m) { return typeof m === 'number'; });
    var sum = marks.reduce(function (a, b) { return a + b; }, 0);
    return '<td>' + (marks.length ? Math.round(sum / marks.length * 10) / 10 : '-') + '</td>';
  }).join('');

  var html =
    '<style>' +
    'body{font:16px/1.5 system-ui,sans-serif;margin:0;padding:20px;background:#F5F8FC;color:#16223D}' +
    'h1{font-size:1.6rem;margin:0 0 4px}p{margin:0 0 14px;color:#4B5A7A}' +
    'input{font:inherit;padding:8px 12px;border:1px solid #D3DDEB;border-radius:8px;width:220px;margin-bottom:14px}' +
    '.wrap{overflow-x:auto;background:#fff;border:1px solid #D3DDEB;border-radius:12px}' +
    'table{border-collapse:collapse;width:100%}th,td{padding:8px 12px;border-bottom:1px solid #E3EAF4;text-align:center}' +
    'thead th{background:#E3EBFD}tbody th{text-align:left}td.low{background:#FDE2E6;color:#A33A45;font-weight:700}' +
    'td.ab{color:#8792A8}td.t{font-weight:700}tfoot td,tfoot th{background:#DDF5E6;font-weight:700}' +
    '</style>' +
    '<h1>' + esc_(PAGE_TITLE) + '</h1>' +
    '<p>' + students.length + ' students · pink = below ' + PAGE_PASS_MARK + ' · updated ' +
    Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'd MMM yyyy, h:mm a') + '</p>' +
    '<input id="q" placeholder="Search roll number" oninput="find(this.value)">' +
    '<div class="wrap"><table><thead><tr><th>Roll No</th>' +
    subjects.map(function (s) { return '<th>' + esc_(s) + '</th>'; }).join('') +
    '<th>Total</th><th>%</th></tr></thead><tbody>' + rows + '</tbody>' +
    '<tfoot><tr><th>Class average</th>' + averages + '<td></td><td></td></tr></tfoot></table></div>' +
    '<script>function find(q){q=q.trim().toUpperCase();document.querySelectorAll("tbody tr").forEach(function(tr){' +
    'tr.style.display=tr.firstChild.textContent.toUpperCase().indexOf(q)>=0?"":"none";});}</script>';

  return HtmlService.createHtmlOutput(html)
    .setTitle(PAGE_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function esc_(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
