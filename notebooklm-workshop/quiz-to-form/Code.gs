/**
 * Turn a quiz table in this Google Sheet into a self-marking Google Forms quiz.
 *
 * Sheet layout (row 1 = headings, one question per row):
 *   Question | Option A | Option B | Option C | Option D | Correct | Marks | Explanation
 * "Correct" is a letter (A-D) or the exact text of the right option.
 * Marks and Explanation are optional (Marks defaults to 1).
 * A table pasted as text into column A (with | between cells) also works.
 *
 * Use: name the Sheet (that becomes the quiz title), then Extensions > Apps Script,
 * paste this, Save, and Run "createQuizForm". The links appear in the Execution log
 * and in a note on cell A1. After the first run there is also a "Quiz" menu.
 */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Quiz')
    .addItem('Create Google Form quiz', 'createQuizForm')
    .addToUi();
}

function createQuizForm() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rows = readQuizRows_(ss.getActiveSheet().getDataRange().getDisplayValues());

  // The quiz is named after the Sheet. No pop-up: a dialog opens in the Sheet tab, and a
  // run started from the editor would wait there unseen until it times out.
  var title = ss.getName();
  ss.toast('Creating ' + rows.length + ' questions...', 'Quiz', 30);

  var form = FormApp.create(title);
  form.setIsQuiz(true);
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(false);
  form.setDescription('Answer every question. Your score is shown after you submit.');
  form.addTextItem().setTitle('Roll number').setRequired(true);

  rows.forEach(function (q) {
    var item = form.addMultipleChoiceItem();
    item.setTitle(q.question)
      .setChoices(q.options.map(function (opt, i) { return item.createChoice(opt, i === q.correct); }))
      .setPoints(q.marks)
      .setRequired(true);
    if (q.explanation) {
      item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q.explanation).build());
    }
  });

  // Responses (with scores) land in a new tab of this Sheet.
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Links go to the Execution log (below the code) and to a note on cell A1.
  var links = 'Quiz created: ' + rows.length + ' questions\n' +
    'Student link: ' + form.getPublishedUrl() + '\n' +
    'Edit link: ' + form.getEditUrl();
  Logger.log(links);
  ss.getActiveSheet().getRange('A1').setNote(links);
  ss.toast('Done. The links are in the note on cell A1.', 'Quiz', 10);
}

/** Turn sheet values into [{question, options, correct, marks, explanation}]. Throws on bad rows. */
function readQuizRows_(values) {
  values = values.map(splitPipeRow_).filter(function (r) {
    return r.some(function (c) { return c !== ''; }) && !isDividerRow_(r);
  });
  if (values.length < 2) throw new Error('No questions found. Put headings in row 1 and one question per row.');

  var head = values[0].map(function (h) { return h.toLowerCase(); });
  var col = function (re) {
    for (var i = 0; i < head.length; i++) if (re.test(head[i])) return i;
    return -1;
  };
  var qCol = col(/^question/), cCol = col(/^(correct|answer)/);
  var mCol = col(/^(marks?|points?)/), eCol = col(/^(explanation|reason|feedback)/);
  var optCols = [];
  head.forEach(function (h, i) { if (/^option/.test(h)) optCols.push(i); });
  if (qCol < 0 || cCol < 0 || optCols.length < 2) {
    throw new Error('Row 1 needs headings: Question, Option A, Option B, ..., Correct.');
  }

  return values.slice(1).map(function (r, n) {
    var where = 'Row ' + (n + 2) + ': ';
    var options = [], letters = [];
    optCols.forEach(function (i, k) {
      if ((r[i] || '') !== '') { options.push(r[i]); letters.push(String.fromCharCode(65 + k)); }
    });
    if (!r[qCol]) throw new Error(where + 'the question is empty.');
    if (options.length < 2) throw new Error(where + 'needs at least two options.');

    var key = (r[cCol] || '').replace(/^option\s*/i, '').replace(/[).:]$/, '').trim();
    var correct = letters.indexOf(key.toUpperCase());
    if (correct < 0) correct = options.indexOf(key);
    if (correct < 0) throw new Error(where + 'the correct answer "' + r[cCol] + '" is not one of the options.');

    var marks = mCol < 0 ? 1 : parseInt(r[mCol], 10);
    return {
      question: r[qCol], options: options, correct: correct,
      marks: isNaN(marks) || marks < 0 ? 1 : marks,
      explanation: eCol < 0 ? '' : (r[eCol] || '')
    };
  });
}

/** A Markdown table pasted as text lands in column A: split it on |. */
function splitPipeRow_(r) {
  var cells = r.map(function (c) { return String(c).trim(); });
  var rest = cells.slice(1).join('');
  if (rest === '' && cells[0].indexOf('|') >= 0) {
    cells = cells[0].replace(/^\|/, '').replace(/\|$/, '').split('|')
      .map(function (c) { return c.trim(); });
  }
  return cells;
}

function isDividerRow_(r) {
  return r.every(function (c) { return /^:?-{2,}:?$/.test(c) || c === ''; });
}
