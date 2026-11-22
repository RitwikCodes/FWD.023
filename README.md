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
  Requests are saved in the browser, and the form clears after a successful save.
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
- **Login and signup pages:** These pages provide the visual layout for sign-in and account creation.  
  They are placeholders only; there is no account system or authentication.

## Run locally

Open `index.html` in a browser, or open the project folder in VS Code and run it with a local web server such as Live Server.

## Current limitations

- The site has no backend. Requests, responses, availability, and theme preferences use this browser's `localStorage`; they are not shared across devices.
- Changes made in another open tab do not update this tab automatically; refresh the page to read the latest saved data.
- The site does not show save confirmations or storage error messages. Errors are written to the browser console.
- Login and signup are not functional authentication. Do not enter real credentials.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Live faculty directory and doubt request form |
| `contact.html` | Teaching and non-teaching staff contact directory |
| `classtopics.html` | Class topics organized by section |
| `requests.html` | Student request history and faculty responses |
| `faculty.html` | Faculty request inbox and availability controls |
| `login.html` | Login page placeholder |
| `signup.html` | Signup page placeholder |
| `script.js` | Search, filtering, local storage, and page interactions |
| `style.css` | Shared layout, responsive rules, and themes |
