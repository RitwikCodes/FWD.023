const requestsStorageKey = "proflineRequests";
const facultyAvailabilityStorageKey = "proflineFacultyAvailability";
const themeStorageKey = "proflineTheme";

const facultyMembers = [
  { id: "faculty-neeraj", name: "Dr. Neeraj K. Dhanwani" },
  { id: "faculty-alok", name: "Dr. Alok Agarwal" },
  { id: "faculty-amey", name: "Dr. Amey S. Deshpande" },
  { id: "faculty-ambalika", name: "Dr. Ambalika Guha" },
  { id: "faculty-bijoy", name: "Dr. Bijoy Chand Chatterjee" },
  { id: "faculty-preeti", name: "Dr. Preeti Bhandari" },
  { id: "faculty-chandra", name: "Dr. Chandra B. Kumar" },
  { id: "faculty-payal", name: "Dr. Payel Mukherjee" },
  { id: "faculty-sandeep", name: "Dr. Sandeep Kumar" },
  { id: "faculty-sahil", name: "Dr. Sahil" },
  { id: "faculty-ankit", name: "Dr. Ankit Jain" },
  { id: "faculty-girija", name: "Dr. Girija Shankar" },
  { id: "faculty-tamalika", name: "Dr. Tamalika Chaira" },
  { id: "faculty-ankita", name: "Dr. Ankita Gaur" },
  { id: "faculty-shashank", name: "Dr. Shashank Sheshar Singh" },
  { id: "faculty-swati", name: "Dr. Swati Chandra" },
  { id: "faculty-aanand", name: "Mr. Aanand Upadhayay" }
];

const defaultFacultyAvailability = {
  "faculty-ambalika": "in-class",
  "faculty-preeti": "in-meeting",
  "faculty-sandeep": "in-class",
  "faculty-girija": "in-lab",
  "faculty-ankita": "in-class",
  "faculty-swati": "in-class"
};

const facultyAvailabilityOptions = [
  { value: "available-now", label: "Available now", badge: "Available now", group: "now" },
  { value: "in-class", label: "In class", badge: "In class · Open later today", group: "later" },
  { value: "in-meeting", label: "In a meeting", badge: "Busy / Meeting · Open later today", group: "later" },
  { value: "in-lab", label: "In a lab", badge: "Busy / In lab · Open later today", group: "later" },
  { value: "open-later", label: "Open later today", badge: "Busy · Open later today", group: "later" },
  { value: "away", label: "Away / unavailable", badge: "Away / unavailable", group: "unavailable" }
];

const getDefaultFacultyAvailability = id => defaultFacultyAvailability[id] || "available-now";
const getFacultyAvailabilityOption = value =>
  facultyAvailabilityOptions.find(option => option.value === value);

function readFacultyAvailability() {
  try {
    const saved = localStorage.getItem(facultyAvailabilityStorageKey);
    const availability = saved ? JSON.parse(saved) : {};
    if (!availability || typeof availability !== "object" || Array.isArray(availability)) {
      throw new Error("Saved faculty availability is not in the expected format.");
    }
    return availability;
  } catch (error) {
    console.error("Could not read saved faculty availability.", error);
    return null;
  }
}

function setDirectoryFacultyAvailability() {
  const cards = document.querySelectorAll(".faculty-grid .faculty-card[id]");
  if (!cards.length) return;

  const availability = readFacultyAvailability();
  if (availability === null) return;

  let availableNowCount = 0;
  let availableLaterCount = 0;
  cards.forEach(card => {
    const savedStatus = availability[card.id];
    const status = getFacultyAvailabilityOption(savedStatus) ||
      getFacultyAvailabilityOption(getDefaultFacultyAvailability(card.id));
    const isAvailableNow = status.group === "now";
    card.classList.toggle("available-now", isAvailableNow);
    card.classList.toggle("available-later", status.group === "later");
    if (isAvailableNow) availableNowCount++;
    if (status.group === "later") availableLaterCount++;

    const badge = card.querySelector(".badge.free, .badge.busy");
    if (badge) {
      badge.classList.toggle("free", isAvailableNow);
      badge.classList.toggle("busy", !isAvailableNow);
      badge.textContent = "● " + status.badge;
    }
  });

  const nowCount = document.querySelector("#available-now-count");
  const laterCount = document.querySelector("#available-later-count");
  if (nowCount) nowCount.textContent = availableNowCount;
  if (laterCount) laterCount.textContent = availableLaterCount;

  const search = document.querySelector("#faculty-search");
  if (search && search.value) search.dispatchEvent(new Event("input"));
}

function setUpFacultyAvailability() {
  const facultySelect = document.querySelector("#faculty-availability-teacher");
  const statusSelect = document.querySelector("#faculty-availability-status");
  const saveButton = document.querySelector("#save-faculty-availability");
  if (!facultySelect || !statusSelect || !saveButton) return;

  facultyMembers.forEach(faculty => {
    const option = makeElement("option", "", faculty.name);
    option.value = faculty.id;
    facultySelect.appendChild(option);
  });
  facultyAvailabilityOptions.forEach(status => {
    const option = makeElement("option", "", status.label);
    option.value = status.value;
    statusSelect.appendChild(option);
  });

  function updateSelectedFacultyStatus() {
    const hasFaculty = Boolean(facultySelect.value);
    statusSelect.disabled = saveButton.disabled = !hasFaculty;
    if (!hasFaculty) return;

    const availability = readFacultyAvailability();
    if (availability === null) {
      saveButton.disabled = true;
      return;
    }
    const savedStatus = availability[facultySelect.value];
    statusSelect.value = getFacultyAvailabilityOption(savedStatus)
      ? savedStatus
      : getDefaultFacultyAvailability(facultySelect.value);
  }

  facultySelect.addEventListener("change", updateSelectedFacultyStatus);
  saveButton.addEventListener("click", () => {
    if (!facultySelect.value || !getFacultyAvailabilityOption(statusSelect.value)) {
      console.error("Choose a faculty member and a valid availability status.");
      return;
    }

    const availability = readFacultyAvailability();
    if (availability === null) return;
    availability[facultySelect.value] = statusSelect.value;
    try {
      localStorage.setItem(facultyAvailabilityStorageKey, JSON.stringify(availability));
    } catch (error) {
      console.error("Could not save faculty availability.", error);
      return;
    }

    setDirectoryFacultyAvailability();
  });
  updateSelectedFacultyStatus();
}

document.querySelectorAll(".nav-menu-toggle").forEach(toggle => {
  const navigation = toggle.closest(".nav-bar");
  const closeNavigation = () => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
  navigation.querySelectorAll(".nav-link").forEach(link =>
    link.addEventListener("click", closeNavigation)
  );
  navigation.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeNavigation();
      toggle.focus();
    }
  });
});

function makeElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function makeDetail(label, value) {
  const paragraph = makeElement("p");
  paragraph.append(makeElement("strong", "", label + ": "), document.createTextNode(value));
  return paragraph;
}

const getStatusClass = (prefix, status) =>
  prefix + " " + status.toLowerCase().split(" ").join("-");

function readSavedRequests() {
  try {
    const saved = localStorage.getItem(requestsStorageKey);
    const requests = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(requests)) throw new Error("Saved requests are not in the expected format.");
    return requests.map((request, index) => ({
      ...request,
      id: request.id || (request.submittedAt || "request") + "-" + index,
      status: request.status || "Submitted",
      response: request.response || ""
    }));
  } catch (error) {
    console.error("Could not read saved requests.", error);
    return null;
  }
}

function makeRequestCard(request) {
  const card = makeElement("article", "request-card");
  card.append(
    makeElement("h3", "", "Doubt Request"),
    makeDetail("Faculty", request.faculty),
    makeDetail("Student", request.student),
    makeDetail("Roll number", request.rollNo),
    makeDetail("Doubt", request.doubt),
    makeDetail("Submitted", new Date(request.submittedAt).toLocaleString())
  );

  const statusLine = makeElement("p");
  statusLine.appendChild(makeElement("span", getStatusClass("request-status", request.status), request.status));
  card.appendChild(statusLine);
  if (request.response) {
    const response = makeElement("p", "request-response");
    response.append(makeElement("strong", "", "Teacher response: "), document.createTextNode(request.response));
    card.appendChild(response);
  }
  return card;
}

function renderSavedRequests() {
  const requestList = document.querySelector("#saved-request-list");
  const emptyMessage = document.querySelector("#saved-request-empty");
  if (!requestList || !emptyMessage) return;

  const requests = readSavedRequests();
  if (requests === null) return;
  requestList.innerHTML = "";
  requests.forEach(request => requestList.appendChild(makeRequestCard(request)));
  emptyMessage.hidden = requests.length > 0;
}

const requestForm = document.querySelector("#doubt-request-form");
if (requestForm) {
  requestForm.addEventListener("submit", event => {
    event.preventDefault();
    const requests = readSavedRequests();
    if (requests === null) return;
    const facultySelect = document.querySelector("#faculty-select");
    const selectedFaculty = facultyMembers.find(faculty => faculty.name === facultySelect.value);
    if (!selectedFaculty) {
      console.error("Choose a faculty member from the live directory.");
      return;
    }
    if (readFacultyAvailability() === null) return;

    const request = {
      id: Date.now() + "-" + requests.length,
      faculty: facultySelect.value,
      student: document.querySelector("#student-name").value.trim(),
      rollNo: document.querySelector("#roll-no").value.trim(),
      doubt: document.querySelector("#doubt-summary").value.trim(),
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      response: ""
    };

    requests.unshift(request);
    try {
      localStorage.setItem(requestsStorageKey, JSON.stringify(requests));
    } catch (error) {
      console.error("Could not save the request.", error);
      return;
    }

    requestForm.reset();
  });
}

function makeFacultyRequestCard(request, number) {
  const card = makeElement("article", "faculty-request-card");
  const topLine = makeElement("div", "faculty-request-topline");
  topLine.append(
    makeElement("span", "faculty-request-number", "REQUEST " + number),
    makeElement("span", getStatusClass("faculty-request-status", request.status), request.status)
  );

  const statusSelect = makeElement("select", "faculty-request-status-select");
  statusSelect.setAttribute("aria-label", `Update status for ${request.student}'s request`);
  ["Submitted", "In progress", "Answered"].forEach(value => {
    const option = makeElement("option", "", value);
    option.value = value;
    option.selected = value === request.status;
    statusSelect.appendChild(option);
  });

  const responseInput = makeElement("textarea", "faculty-request-response-input");
  responseInput.rows = 2;
  responseInput.placeholder = "Write a response for the student...";
  responseInput.value = request.response;

  const statusLabel = makeElement("label", "", "Status");
  statusLabel.appendChild(statusSelect);
  const responseLabel = makeElement("label", "", "Teacher response");
  responseLabel.appendChild(responseInput);
  const saveButton = makeElement("button", "faculty-request-save", "Save update");
  saveButton.type = "button";
  saveButton.addEventListener("click", () =>
    saveFacultyRequest(request, card, statusSelect, responseInput)
  );

  const controls = makeElement("div", "faculty-request-controls");
  controls.append(statusLabel, responseLabel, saveButton);
  card.append(
    topLine,
    makeElement("h3", "", request.student),
    makeElement("p", "faculty-request-details", `Roll number: ${request.rollNo} · Faculty: ${request.faculty}`),
    makeElement("p", "faculty-request-doubt-label", "Doubt"),
    makeElement("p", "faculty-request-doubt", request.doubt),
    makeElement("p", "faculty-request-date", "Submitted " + new Date(request.submittedAt).toLocaleString()),
    controls
  );
  return card;
}

function saveFacultyRequest(request, card, statusSelect, responseInput) {
  const requests = readSavedRequests();
  if (requests === null) return;

  const savedRequest = requests.find(item => item.id === request.id);
  if (!savedRequest) {
    console.error("Request not found; refresh the page and try again.");
    return;
  }
  savedRequest.status = statusSelect.value;
  savedRequest.response = responseInput.value.trim();
  try {
    localStorage.setItem(requestsStorageKey, JSON.stringify(requests));
  } catch (error) {
    console.error("Could not save the request update.", error);
    return;
  }

  const badge = card.querySelector(".faculty-request-status");
  badge.className = getStatusClass("faculty-request-status", savedRequest.status);
  badge.textContent = savedRequest.status;
}

function renderFacultyRequests() {
  const requestList = document.querySelector("#faculty-request-list");
  const requestCount = document.querySelector("#faculty-request-count");
  const emptyState = document.querySelector("#faculty-empty-state");
  if (!requestList || !requestCount || !emptyState) return;

  const requests = readSavedRequests();
  if (requests === null) return;
  requestCount.textContent = requests.length;
  requestList.innerHTML = "";
  requests.forEach((request, index) =>
    requestList.appendChild(makeFacultyRequestCard(request, String(index + 1).padStart(2, "0")))
  );
  emptyState.hidden = requests.length > 0;
}

function setUpFacultySearch() {
  document.querySelectorAll(".faculty-search").forEach(panel => {
    const input = panel.querySelector(".faculty-search-input");
    const status = panel.querySelector(".faculty-search-status");
    const grid = document.querySelector(panel.getAttribute("data-search-target"));
    if (!input || !status || !grid) return;

    const cards = grid.querySelectorAll(".faculty-card");
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let matches = 0;
      cards.forEach(card => {
        const found = card.textContent.toLowerCase().includes(query);
        card.classList.toggle("search-hidden", !found);
        if (found) matches++;
      });
      status.textContent = query
        ? `${matches} faculty ${matches === 1 ? "member" : "members"} found.`
        : "";
    });
  });
}

renderSavedRequests();
renderFacultyRequests();
setUpFacultySearch();
setDirectoryFacultyAvailability();
setUpFacultyAvailability();

function setQuickFilter(buttonSelector, ...radioSelectors) {
  const button = document.querySelector(buttonSelector);
  const radios = radioSelectors.map(selector => document.querySelector(selector));
  if (button && radios.every(Boolean)) {
    button.addEventListener("click", () => radios.forEach(radio => { radio.checked = true; }));
  }
}

setQuickFilter("#show-all-faculty", "#availability-all", "#filter-all");
setQuickFilter("#show-available-now", "#availability-now");
setQuickFilter("#show-open-later", "#availability-later");
setQuickFilter("#show-all-departments", "#filter-all");

function updateTheme(isDarkMode) {
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.querySelectorAll(".theme-toggle").forEach(button => {
    if (button.classList.contains("icon-theme-toggle")) {
      button.setAttribute("aria-label", "Toggle dark mode");
    } else {
      button.textContent = isDarkMode ? "Light mode" : "Dark mode";
      button.setAttribute("aria-label", `Switch to ${isDarkMode ? "light" : "dark"} mode`);
    }
    button.setAttribute("aria-pressed", String(isDarkMode));
  });
}

let isDarkMode = false;
try {
  isDarkMode = localStorage.getItem(themeStorageKey) === "dark";
} catch (error) {
  console.error("Could not read the saved theme preference.", error);
}
updateTheme(isDarkMode);
document.querySelectorAll(".theme-toggle").forEach(button => {
  button.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    updateTheme(isDarkMode);
    try {
      localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  });
});
