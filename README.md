# 🎓 ProfLine — Real-Time Faculty Directory & Doubt Portal

**ProfLine** is a web-based student platform designed to streamline office hour queues, real-time teacher availability tracking, and missed class catch-ups for academic institutions. 

Instead of waiting outside offices or guessing whether a professor is available, students can view real-time status updates, active lecture topics, contact info, and submit doubt requests directly.

---

## ✨ Features

* **🔴 Live Availability Directory (`index.html`):** Real-time tracking of faculty members with filter controls by department (Maths, English, CP, Physics, EEE) and instant availability status (*Available now* vs. *Open later*).
* **📅 Ongoing Classes & Missed Lecture Topics (`schedule.html` / `classtopics.html`):** Keeps absent or catching-up students updated on what exact topics were covered in class during each time slot, with direct links to clear doubts.
* **📬 Direct Faculty Contact Directory (`contact.html`):** Complete list of faculty offices, departmental tags, and direct `@teachers.sao.ac.in` institutional email links.
* **✍️ Interactive Doubt Request System:** Integrated inline queue form for students to submit specific doubt summaries alongside their Name and Roll Number.
* **📱 Fully Responsive Design:** Clean CSS styling optimized for both desktop and mobile viewing.

---

## 📁 Repository Structure

```text
ProfLine/
├── index.html        # Main landing page & live faculty directory with filtering
├── contact.html      # Faculty contact directory (emails & office room numbers)
├── schedule.html     # Class schedule & active lecture topics tracker
├── requests.html     # Doubt request form interface
├── style.css         # Main application stylesheet
└── README.md         # Project documentation
