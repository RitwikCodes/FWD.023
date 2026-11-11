const requestsStorageKey = "proflineRequests";

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function makeDetail(label, value) {
  const paragraph = makeElement("p");
  paragraph.append(makeElement("strong", "", `${label}: `), document.createTextNode(value));
  return paragraph;
}

function statusClass(prefix, status) {
  return `${prefix} ${status.toLocaleLowerCase().replaceAll(" ", "-")}`;
}

function readSavedRequests(feedbackElement) {
  try {
    const savedRequests = localStorage.getItem(requestsStorageKey);
    const requests = savedRequests ? JSON.parse(savedRequests) : [];

    if (!Array.isArray(requests)) {
      throw new Error("Saved requests are not in the expected format.");
    }

    return requests.map((request, index) => ({
      ...request,
      id: request.id || `${request.submittedAt || "request"}-${index}-${request.rollNo || ""}`,
      status: request.status || "Submitted",
      response: request.response || ""
    }));
  } catch (error) {
    feedbackElement.textContent =
      "Could not read saved requests from this browser. Check browser storage settings and try again.";
    feedbackElement.classList.add("error");
    return null;
  }
}

function makeRequestCard(request) {
  const card = makeElement("article", "request-card");
  card.append(makeElement("h3", "", "Doubt Request"));

  [
    ["Faculty", request.faculty],
    ["Student", request.student],
    ["Roll number", request.rollNo],
    ["Doubt", request.doubt],
    ["Submitted", new Date(request.submittedAt).toLocaleString()]
  ].forEach(([label, value]) => card.append(makeDetail(label, value)));

  const requestStatus = request.status || "Submitted";
  const status = makeElement("span", statusClass("request-status", requestStatus), requestStatus);
  const statusLine = makeElement("p");
  statusLine.append(status);
  card.append(statusLine);

  if (request.response) {
    const response = makeElement("p", "request-response");
    response.append(makeElement("strong", "", "Teacher response: "), document.createTextNode(request.response));
    card.append(response);
  }

  return card;
}

function renderSavedRequests() {
  const requestList = document.querySelector("#saved-request-list");
  const emptyMessage = document.querySelector("#saved-request-empty");
  const feedback = document.querySelector("#requests-feedback");

  if (!requestList || !emptyMessage || !feedback) {
    return;
  }

  const requests = readSavedRequests(feedback);
  if (!requests) {
    return;
  }

  requestList.replaceChildren(...requests.map(makeRequestCard));
  emptyMessage.hidden = requests.length > 0;
}

const requestForm = document.querySelector("#doubt-request-form");

if (requestForm) {
  const feedback = document.querySelector("#request-feedback");

  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "";
    feedback.classList.remove("success", "error");

    const requests = readSavedRequests(feedback);
    if (!requests) {
      return;
    }

    const request = {
      id: window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      faculty: document.querySelector("#faculty-select").value,
      student: document.querySelector("#student-name").value.trim(),
      rollNo: document.querySelector("#roll-no").value.trim(),
      doubt: document.querySelector("#doubt-summary").value.trim(),
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      response: ""
    };

    try {
      localStorage.setItem(requestsStorageKey, JSON.stringify([request, ...requests]));
    } catch (error) {
      feedback.textContent =
        "Your request could not be saved in this browser. Check browser storage settings and try again.";
      feedback.classList.add("error");
      return;
    }

    window.dispatchEvent(new Event("profline-requests-updated"));
    requestForm.reset();
    feedback.textContent = "Your request was saved. You can see it under My Requests and in Faculty View on this browser.";
    feedback.classList.add("success");
  });
}

if (document.querySelector("#saved-request-list")) {
  renderSavedRequests();
}

function makeFacultyRequestCard(request, index) {
  const card = makeElement("article", "faculty-request-card");
  const topLine = makeElement("div", "faculty-request-topline");
  const requestNumber = makeElement("span", "faculty-request-number", `REQUEST ${String(index + 1).padStart(2, "0")}`);
  const requestStatus = request.status || "Submitted";
  const status = makeElement("span", statusClass("faculty-request-status", requestStatus), requestStatus);
  topLine.append(requestNumber, status);

  const statusSelect = makeElement("select", "faculty-request-status-select");
  statusSelect.setAttribute("aria-label", `Update status for ${request.student}'s request`);
  ["Submitted", "In progress", "Answered"].forEach((value) => {
    const option = makeElement("option", "", value);
    option.selected = value === requestStatus;
    option.value = value;
    statusSelect.append(option);
  });

  const responseInput = makeElement("textarea", "faculty-request-response-input");
  responseInput.rows = 2;
  responseInput.placeholder = "Write a response for the student...";
  responseInput.value = request.response || "";

  const statusLabel = makeElement("label", "", "Status");
  statusLabel.append(statusSelect);
  const responseLabel = makeElement("label", "", "Teacher response");
  responseLabel.append(responseInput);
  const saveButton = makeElement("button", "faculty-request-save", "Save update");
  saveButton.type = "button";
  saveButton.dataset.requestId = request.id;

  const controls = makeElement("div", "faculty-request-controls");
  controls.append(statusLabel, responseLabel, saveButton);
  card.append(
    topLine,
    makeElement("h3", "", request.student),
    makeElement("p", "faculty-request-details", `Roll number: ${request.rollNo} · Faculty: ${request.faculty}`),
    makeElement("p", "faculty-request-doubt-label", "Doubt"),
    makeElement("p", "faculty-request-doubt", request.doubt),
    makeElement("p", "faculty-request-date", `Submitted ${new Date(request.submittedAt).toLocaleString()}`),
    controls
  );
  return card;
}

function renderFacultyRequests() {
  const requestList = document.querySelector("#faculty-request-list");
  const requestCount = document.querySelector("#faculty-request-count");
  const emptyState = document.querySelector("#faculty-empty-state");
  const feedback = document.querySelector("#faculty-feedback");

  if (!requestList || !requestCount || !emptyState || !feedback) {
    return;
  }

  feedback.textContent = "";
  feedback.classList.remove("error");
  const requests = readSavedRequests(feedback);
  if (!requests) {
    return;
  }

  requestCount.textContent = String(requests.length);
  requestList.replaceChildren(...requests.map(makeFacultyRequestCard));
  emptyState.hidden = requests.length > 0;
}

if (document.querySelector("#faculty-request-list")) {
  renderFacultyRequests();
  const requestList = document.querySelector("#faculty-request-list");
  const feedback = document.querySelector("#faculty-feedback");

  requestList.addEventListener("click", (event) => {
    const saveButton = event.target.closest(".faculty-request-save");
    if (!saveButton) {
      return;
    }

    feedback.textContent = "";
    feedback.classList.remove("success", "error");
    const requests = readSavedRequests(feedback);
    if (!requests) {
      return;
    }

    const card = saveButton.closest(".faculty-request-card");
    const request = requests.find((item) => item.id === saveButton.dataset.requestId);
    if (!request || !card) {
      feedback.textContent = "This request could not be found. Refresh the page and try again.";
      feedback.classList.add("error");
      return;
    }

    request.status = card.querySelector(".faculty-request-status-select").value;
    request.response = card.querySelector(".faculty-request-response-input").value.trim();

    try {
      localStorage.setItem(requestsStorageKey, JSON.stringify(requests));
    } catch (error) {
      feedback.textContent = "The update could not be saved in this browser. Check browser storage settings and try again.";
      feedback.classList.add("error");
      return;
    }

    window.dispatchEvent(new Event("profline-requests-updated"));
    feedback.textContent = "Request status and response saved.";
    feedback.classList.add("success");
  });

  window.addEventListener("profline-requests-updated", renderFacultyRequests);
  window.addEventListener("storage", (event) => {
    if (event.key === requestsStorageKey || event.key === null) {
      renderFacultyRequests();
    }
  });
}

if (document.querySelector("#saved-request-list")) {
  window.addEventListener("profline-requests-updated", renderSavedRequests);
  window.addEventListener("storage", (event) => {
    if (event.key === requestsStorageKey || event.key === null) {
      renderSavedRequests();
    }
  });
}

document.querySelectorAll(".faculty-search").forEach((searchPanel) => {
  const searchInput = searchPanel.querySelector(".faculty-search-input");
  const searchStatus = searchPanel.querySelector(".faculty-search-status");
  const facultyGrid = document.querySelector(searchPanel.dataset.searchTarget);

  if (!searchInput || !searchStatus || !facultyGrid) {
    return;
  }

  const facultyCards = facultyGrid.querySelectorAll(".faculty-card");

  function filterFaculty() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let matchingCards = 0;

    facultyCards.forEach((card) => {
      const matches = card.textContent.toLocaleLowerCase().includes(query);
      card.classList.toggle("search-hidden", !matches);

      if (matches) {
        matchingCards += 1;
      }
    });

    searchStatus.textContent = query
      ? `${matchingCards} ${matchingCards === 1 ? "faculty member" : "faculty members"} found.`
      : "";
  }

  searchInput.addEventListener("input", filterFaculty);
});
