# ProfLine

## The gist

ProfLine is a static website that helps students find faculty information, check availability, and submit doubt requests.
It also provides class-topic and contact directories, plus a faculty page for reviewing and updating requests.

## Features

- **Faculty directory and availability:** Browse faculty profiles and see availability badges and counts.  
  Faculty can save a status on the Faculty View page; the directory reads saved statuses when opened or refreshed.
- **Search and filters:** Search faculty by name, department, or status, and filter by department or availability.  
  The directory's summary buttons also select common filters, such as "Available now" and "Open later."
- **Doubt requests:** Students can choose a faculty member and submit their name, roll number, and doubt summary.  
  Requests are saved in the browser, the form confirms a successful save, and a signed-in demo student can edit or cancel their pending requests.
- **My Requests:** Students can view saved requests, their current status, and any faculty response.  
  This page reads the same browser storage used by the Faculty View page.
- **Faculty inbox:** Faculty can review submitted requests, change request statuses, and write responses.  
  Updates are saved in the browser and appear in My Requests when that page is opened or refreshed.
- **Contact directory:** Browse teaching and non-teaching staff, search their details, and follow email links.  
  Faculty cards include available contact information such as department, office, and email.
- **Class topics:** Review the topics listed for Sections A, B, C, and D.  
  Topic entries link to the corresponding teacher in the Contact Faculty page.
- **Theme and navigation:** Toggle dark mode and use the responsive navigation menu on smaller screens.  
  The theme preference is saved in the browser; it does not update other already-open tabs automatically.
- **Demo login:** Sign in with the student or teacher demo credentials shown on `login.html`.
  Student sign-in opens the directory and student-owned requests; teacher sign-in opens the faculty inbox. My Requests and Faculty View show the signed-in user and prompt guests or the wrong role to sign in.
- **Signup page:** This page is a visual placeholder and does not create accounts.


## Current limitations

- The site has no backend. Requests, responses, availability, and theme preferences use this browser's `localStorage`; they are not shared across devices.
- Demo login credentials are hard-coded in `script.js` and are visible to every visitor. The login is only for demonstrating the page flow; it does not provide real authentication, authorization, or privacy.
- Changes made in another open tab do not update this tab automatically; refresh the page to read the latest saved data.
- Sign-up is not functional, and demo sessions last only for the current browser tab.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Live faculty directory and doubt request form |
| `contact.html` | Teaching and non-teaching staff contact directory |
| `classtopics.html` | Class topics organized by section |
| `requests.html` | Student request history and faculty responses |
| `faculty.html` | Faculty request inbox and availability controls |
| `login.html` | Demo login form and demo credentials |
| `signup.html` | Signup page placeholder |
| `script.js` | Demo login, search, filtering, local storage, and page interactions |
| `style.css` | Shared layout, responsive rules, and themes |
