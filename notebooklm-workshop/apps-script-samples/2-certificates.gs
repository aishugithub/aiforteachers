/**
 * Certificates in one click.
 *
 * Sheet layout (row 1 = headings, one student per row):
 *   Name | Class | Event | Position | Date | Certificate
 * The first run makes a certificate template in Google Docs (you can edit its
 * wording and design). Each row then becomes a PDF in a Drive folder called
 * "Certificates", and its link goes in the Certificate column. Rows that
 * already have a link are skipped.
 *
 * Template placeholders: {{Name}} {{Class}} {{Event}} {{Position}} {{Date}}
 *
 * Use: Extensions > Apps Script, paste this, Save, then Run "makeCertificates".
 * After the first run there is also a "Certificates" menu in the Sheet.
 */

var SCHOOL_NAME = 'Your School Name';   // change to your school
var FOLDER_NAME = 'Certificates';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Certificates')
    .addItem('Make certificates', 'makeCertificates')
    .addItem('Open the template', 'openTemplate')
    .addToUi();
}

function makeCertificates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var values = sheet.getDataRange().getDisplayValues();
  var template = DriveApp.getFileById(getTemplateId_());
  var folder = getFolder_(FOLDER_NAME);
  var made = 0;

  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    if (!r[0] || r[5]) continue;   // no name, or already made

    var copy = template.makeCopy(r[0] + ' - ' + r[2], folder);
    var doc = DocumentApp.openById(copy.getId());
    var body = doc.getBody();
    ['Name', 'Class', 'Event', 'Position', 'Date'].forEach(function (key, k) {
      body.replaceText('\\{\\{' + key + '\\}\\}', r[k]);
    });
    doc.saveAndClose();

    var pdf = folder.createFile(copy.getAs('application/pdf')).setName(r[0] + ' - ' + r[2] + '.pdf');
    copy.setTrashed(true);   // keep only the PDF
    sheet.getRange(i + 1, 6).setValue(pdf.getUrl());
    made++;
    ss.toast(made + ' certificate(s) made...', 'Certificates', 5);
  }
  ss.toast(made + ' certificate(s) saved in the "' + FOLDER_NAME + '" folder in Drive.', 'Certificates', 10);
}

function openTemplate() {
  var url = DocumentApp.openById(getTemplateId_()).getUrl();
  SpreadsheetApp.getActiveSpreadsheet().toast('Template: ' + url, 'Certificates', 20);
  Logger.log('Template: ' + url);
}

/** The template's ID is remembered in this Sheet. If it's missing or deleted, make a new one. */
function getTemplateId_() {
  var props = PropertiesService.getDocumentProperties();
  var id = props.getProperty('templateId');
  if (id) {
    try { if (!DriveApp.getFileById(id).isTrashed()) return id; } catch (e) { /* deleted */ }
  }
  id = createTemplate_();
  props.setProperty('templateId', id);
  return id;
}

/** A simple landscape A4 certificate. Edit the Doc afterwards to change the design. */
function createTemplate_() {
  var doc = DocumentApp.create('Certificate template');
  var body = doc.getBody();
  body.setPageWidth(842).setPageHeight(595)
    .setMarginTop(60).setMarginBottom(40).setMarginLeft(72).setMarginRight(72);
  body.clear();

  var lines = [
    [SCHOOL_NAME, 20, true, '#16223D'],
    ['CERTIFICATE OF ACHIEVEMENT', 30, true, '#2A54C8'],
    ['This is to certify that', 14, false, '#4B5A7A'],
    ['{{Name}}', 34, true, '#16223D'],
    ['of Class {{Class}}, for {{Position}} in {{Event}}', 16, false, '#16223D'],
    ['held on {{Date}}.', 14, false, '#4B5A7A'],
    ['', 30, false, '#16223D'],
    ['Class Teacher                                                                Principal', 13, true, '#16223D']
  ];
  lines.forEach(function (l, k) {
    var p = k === 0 ? body.getParagraphs()[0].setText(l[0]) : body.appendParagraph(l[0]);
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setSpacingAfter(10)
      .editAsText().setFontSize(l[1]).setBold(l[2]).setForegroundColor(l[3]).setFontFamily('Georgia');
  });
  doc.saveAndClose();
  return doc.getId();
}

function getFolder_(name) {
  var found = DriveApp.getFoldersByName(name);
  return found.hasNext() ? found.next() : DriveApp.createFolder(name);
}
