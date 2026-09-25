# JEE Mock CBT

A browser-based mock test platform for JEE Main. Teachers or students build a paper from a previous-year-question (PYQ) bank, sit it in a screen laid out like the official computer-based test, see the score right after submitting, and download a PDF report.

Everything runs in the browser. There is no server and no login, so the app can be hosted on any static host (GitHub Pages, Netlify, Firebase Hosting, a college web server) or opened straight from the folder.

## Features

| Requirement | Where it lives |
|---|---|
| Custom duration in minutes (75, 180, anything from 1 to 600) | Setup → Test details |
| Filter by all subjects, specific subjects, or individual chapters | Setup → Subjects and chapters |
| Pick and combine PYQ years (for example 2025 + 2026) | Setup → Previous-year papers |
| Question bank source | `questions.js` (built-in) plus JSON/CSV import from **Manage bank** |
| CBT-style exam screen | Section tabs, countdown timer, candidate panel, colour-coded question palette with live counts, on-screen keypad for numericals |
| Official button set | Save & Next, Clear, Save & Mark for Review, Mark for Review & Next, Back, Next, Submit, plus the exam summary table before submitting |
| Instant score | Result screen right after submitting, with positive marks, negative marks and net score |
| PDF report | Cover summary, subject-wise table, chapter-wise split, then every question with the options, the student's answer, the correct answer, marks and solution |

Palette states follow the official instructions: Not Visited, Not Answered, Answered, Marked for Review, and Answered & Marked for Review (counted for evaluation). Navigating away without **Save** does not save the answer, same as the real exam. A test in progress is saved in the browser, so a refresh or accidental tab close can be resumed; the clock keeps running meanwhile.

## Question bank

The built-in bank (`questions.js`) has 84 **original** practice questions written in JEE Main style (28 per subject, MCQ + numerical) tagged with years 2023–2026 so the filters can be demonstrated. They are not official NTA questions. For real PYQs, import your own file.

### CSV format

```
id,subject,chapter,year,type,question,option_a,option_b,option_c,option_d,answer,solution
P101,Physics,Kinematics,2025,MCQ,"A car accelerates ...",2 m/s^{2},4 m/s^{2},5 m/s^{2},10 m/s^{2},B,"a = 20/5"
C101,Chemistry,Atomic Structure,2026,NUM,"Angular nodes in a 4d orbital ____.",,,,,2,"l = 2"
```

- `type`: `MCQ` or `NUM` (also accepts `numerical`, `integer`).
- `answer`: `A`–`D` (or `1`–`4`) for MCQs; a number or a range such as `2.4-2.6` for numericals.
- `^{..}` gives superscript and `_{..}` subscript. Unicode symbols (², √, π, ⇌) work directly.
- An optional `image` column accepts a `data:` URI or an `https://` URL for figures.

A Google Sheet exported as CSV works. The **Download CSV template** button gives a starter file.

### JSON format

An array of objects with the same fields as `questions.js` (`options` as an array, `answer` as a 0-based index for MCQs).

## Running it

Open `index.html` in a browser, or serve the folder:

```
cd jee-mock-test
python3 -m http.server 8000
```

To put it online, enable GitHub Pages for the repository and point it at the branch, or drag the folder into Netlify. PDF generation loads `html2canvas` and `jsPDF` from cdnjs, so it needs an internet connection.

## Files

- `index.html`: the whole app (UI, exam engine, scoring, PDF report)
- `questions.js`: built-in sample bank and schema notes
