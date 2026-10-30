# Admin demo pack: "A Class 12 teacher's week"

Fictional sources for the admin part of the workshop (slides "Teachers also run the school" and "Same school task, which tool?", and Part C of the hands-on guide). Everything here is invented. Greenfield Public School and its staff do not exist, and students appear only as roll numbers.

**The story:** Mrs. Kavitha R is PGT Physics and class teacher of 12B. It's the end of October. In one week she has received two circulars, an invigilation roster, a staff meeting that *changed some dates*, five parent messages (including the JEE parent), and she has a Class 11 unit test paper to finish. That is exactly what a senior-secondary teacher's admin week looks like.

**In Gemini Notebook:** notebook **"Class Teacher 12B – School Admin (Demo)"** has all nine sources, added as Copied text.

## Files

| Source | What it is for on the slides |
|---|---|
| `01-circular-041-half-yearly-results-ptm` | "Last date to upload Term 1 marks?" (slide: Same task, row 1). PTM, CBSE data verification, practical records |
| `02-circular-043-unit-test-3-and-retest-policy` | "What is the re-test rule?" (School rulebook card). Class 11 UT3 and Class 12 Pre-Board 1 |
| `03-staff-handbook-extract` | Leave, invigilation, 75% attendance (CBSE), parent communication and AI/data rules |
| `04-ut3-invigilation-duty-roster` | "When are my invigilation duties?" |
| `05-staff-meeting-transcript-27-oct` | Staff meeting minutes card. **Changes the PTM and question paper dates** |
| `06-class-12B-term-records` | Class list card. Same UT1/UT2/attendance numbers as the Part C sample sheet |
| `07-parent-messages-this-week` | Parent communication card |
| `08-class-11-physics-ut3-blueprint-and-draft-paper` | Question paper check card. The draft is deliberately off-blueprint |
| `09-annual-day-invitation-2025` | "Draft the Annual Day invitation" (slide: Same task, row 4) |

Edit the `.md` files in `sources/`, then run `python build_pdfs.py` to rebuild `pdf/`.

## Live demo: prompts and the answers to expect

If an answer differs, that is your verification moment: click the citation.

**1. The one-line win (slide: Same task, row 1)**
> What's the last date to upload Term 1 marks?

Expected: **Thursday, 5 November 2026, 4:00 pm**, cited to Circular 041. Ask ChatGPT or Claude with no file: they can't know.

**2. The circular checklist, with a twist**
> I am Mrs. Kavitha R, PGT Physics and class teacher of 12B. List every action I must take from all these sources, with deadlines, as a table sorted by date. Where the staff meeting changed a date in a circular, use the new date and mark it "changed".

Expected highlights:
- Mon 2 Nov: October attendance-shortage letters (12B: rolls 05, 07, 10); collect CBSE data printouts
- Thu 5 Nov, 4 pm: Term 1 marks in the ERP
- Fri 6 Nov: below-40% list to Mrs. Latha (Physics: rolls 03, 07, 10, 12)
- Mon 9 Nov: report card remarks; Class 11 UT3 portions in the diary and app; remedial consent slips back
- **Thu 12 Nov: Class 11 UT3 Physics paper, key and blueprint to the Exam Cell (changed from 18 Nov)**
- Fri 13 Nov: signed CBSE data printouts to the office; two compère names from 12B
- **Mon 23 Nov: PTM slots to parents (changed from 16 Nov)**
- **Wed 25 Nov: check report cards (changed from 18 Nov)**
- **Sat 28 Nov: PTM (changed from 21 Nov)**
- Mon 30 Nov: Pre-Board 1 papers (two sets); science exhibition team (Class 11)
- 1, 2, 4, 7 Dec: UT3 invigilation (see 3)
- **8 or 9 Dec: show Class 11 UT3 scripts (changed from "by 10 Dec", because of the dress rehearsal)**
- Fri 11 Dec: UT3 marks in the ERP · 14 to 23 Dec: Pre-Board 1 · Tue 15 Dec: practical records signed

Teaching point: a circular alone gives the *wrong* PTM date. The notebook reads everything together.

**3. My invigilation duties**
> When and where are my (Mrs. Kavitha R) invigilation duties for Class 11 UT3? What time do I report?

Expected: 1 Dec, 11A, Room 201 · 2 Dec, reliever · 3 Dec, no invigilation (staff room from 8:30 am, collect scripts at 10:00 am) · 4 Dec, 11C, Room 203 · 7 Dec, 11B, Room 202. Report at 8:15 am.

**4. School rulebook**
> What is the re-test rule? Is there a re-test for the pre-board? Quote the circular number.

Expected: medical reasons only, medical certificate within 3 working days, re-test within 7 days, one per subject; other absences (including coaching-centre tests) are AB; **no re-test for Pre-Boards**: medical absentees are assessed on Pre-Board 2 (Circular 043, section 6).

**5. Parent replies (the most relatable one)**
> Draft a short, polite reply to each parent message, following the school rules. Cite the rule you used for each reply.

Expected:
- Roll 07 (wedding 15 to 17 Dec): misses the **Physics Pre-Board on 16 Dec**; no re-test for pre-boards, and a family function is not a medical reason; the parent can write to the Principal at least 7 days before; the teacher must not promise anything.
- Roll 10 (works Saturdays): weekday meeting, 3:30 to 4:15 pm, by appointment on the app.
- Roll 12 (topper's marks): can't share other students' marks or ranks; can share the class average.
- **Roll 03: the parent has taken leave for 21 Nov, but the PTM moved to 28 Nov.** Pre-Board portions: full syllabus.
- Roll 01 (JEE, stay home in January): no. CBSE needs 75% attendance; practicals and Pre-Board 2 are in January; coaching is not approved leave (Handbook 6.1 and 6.1A).

**6. Staff meeting minutes**
> Write the minutes of the 27 October staff meeting: decisions, action items with the person responsible and deadline, and open questions.

**7. Question paper check**
> Compare my draft Class 11 Physics UT3 paper with the blueprint. Map each question to a chapter, total the marks per chapter, and list what is over- or under-tested.

Expected: Ch 5 has 6 marks (blueprint 7, under by 1) · Ch 6 has 9 (blueprint 6, over by 3) · Ch 7 has 10 (blueprint 7, over by 3) · **Ch 8 Mechanical Properties of Solids has 0 (blueprint 5, missing entirely)**. Competency-based marks: 6 (Q10, Q13), which is fine. Q12's answer is −100 J (work done by friction).

**8. Class list (same numbers as guide Part C)**
> Which roll numbers scored below 40% in Half-Yearly Physics? Show their attendance too. Which of them are also below the CBSE 75% attendance rule?

Expected: 03 (25/70, 79%), 07 (21/70, 71%), 10 (24/70, 68%), 12 (27/70, 82%). Below 75% as well: **07 and 10**. (Roll 05 is below 75% too, but passed at 31/70.)
Then: "What is the class average in UT1 and UT2?" Correct: 16.0 and 16.5. This is the moment to compare with ChatGPT or Claude.

**9. Annual Day invitation (slide: Same task, row 4)**
> Using last year's Annual Day letter as a model, draft this year's invitation for Saturday, 12 December 2026. Leave [blanks] for anything not in the sources.

Expected: same structure as last year, with the new date. Good if it leaves the theme, time and chief guest blank instead of inventing them. If it invents them, that's a hallucination to point out.

## Studio outputs already made in the notebook

| Output | Customised for | Status |
|---|---|---|
| Audio Overview (Brief), "Mrs Kavitha's November and December Checklist" | The class teacher listening on her commute; changed dates called out | Ready |
| Infographic, "Classes 11 & 12 Key Dates" | Staff-room notice board, portrait, changed dates marked | Ready, checked |
| Slide Deck (Presenter slides) | 12B PTM on 28 Nov, for parents; no individual student data | Generating |
| Report: my to-do checklist | Table by date with "(changed from …)" | Queued (free-plan limit) |
| Mind Map | School rules for Class 11 and 12 teachers | Queued |
| Data Table | Every date and deadline, with a "changed by meeting?" column | Queued |
