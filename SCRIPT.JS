
// ======================================
// SMART SCHOOL - COMPLETE JAVASCRIPT
// ======================================

// LOAD AND SAVE DATA

function loadData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.warn("Could not load saved data:", error);
        return [];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn("Could not save data:", error);
    }
}

let complaints = loadData("complaints");
let lostItems = loadData("lostItems");
let suggestions = loadData("suggestions");
let announcements = loadData("announcements");
let ecoActivities = loadData("ecoActivities");

// REUSABLE CARD FUNCTION

function createCard(titleText, details) {
    const card = document.createElement("div");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = titleText;

    const paragraph = document.createElement("p");
    paragraph.textContent = details;

    card.append(title, paragraph);
    return card;
}

// REUSABLE DELETE BUTTON

function createDeleteButton(onDelete) {
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.style.background = "#c0392b";

    button.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this?")) {
            onDelete();
            alert("Item deleted successfully!");
        }
    });

    return button;
}

// ======================================
// COMPLAINT REPORTING SYSTEM
// ======================================

const form = document.getElementById("complaintForm");
const complaintList = document.getElementById("complaintList");
const adminComplaintList =
    document.getElementById("adminComplaintList");

const complaintSearch =
    document.getElementById("complaintSearch");

const priorityFilter =
    document.getElementById("priorityFilter");

const statusFilter =
    document.getElementById("statusFilter");

// DISPLAY COMPLAINTS

function displayComplaints() {

    complaints.forEach(c => {
        if (!c.status) c.status = "Pending";
        if (!c.priority) c.priority = "Medium";
    });

    // DASHBOARD STATISTICS

    document.getElementById("totalCount").textContent =
        complaints.length;

    document.getElementById("pendingCount").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("progressCount").textContent =
        complaints.filter(c => c.status === "In Progress").length;

    document.getElementById("resolvedCount").textContent =
        complaints.filter(c => c.status === "Resolved").length;

    complaintList.replaceChildren();
    adminComplaintList.replaceChildren();

    // STUDENT COMPLAINT LIST

    complaints.forEach((complaint, index) => {

        const card = createCard(
            complaint.category,
            "Location: " + complaint.location +
            " | Priority: " + complaint.priority +
            " | Problem: " + complaint.description +
            " | Status: " + complaint.status
        );

        card.appendChild(createDeleteButton(function () {
            complaints.splice(index, 1);
            saveData("complaints", complaints);
            displayComplaints();
        }));

        complaintList.appendChild(card);
    });

    // SEARCH AND FILTER

    const searchText =
        complaintSearch.value.toLowerCase().trim();

    const selectedPriority = priorityFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredComplaints = complaints
        .map((complaint, index) => ({ complaint, index }))
        .filter(item => {

            const c = item.complaint;

            const matchesSearch =
                (c.name || "").toLowerCase().includes(searchText) ||
                (c.category || "").toLowerCase().includes(searchText) ||
                (c.description || "").toLowerCase().includes(searchText) ||
                (c.location || "").toLowerCase().includes(searchText);

            const matchesPriority =
                !selectedPriority ||
                selectedPriority === "All" ||
                c.priority === selectedPriority;

            const matchesStatus =
                !selectedStatus ||
                selectedStatus === "All" ||
                c.status === selectedStatus;

            return matchesSearch &&
                matchesPriority &&
                matchesStatus;
        });

    // ADMIN COMPLAINT LIST

    filteredComplaints.forEach(item => {

        const complaint = item.complaint;
        const index = item.index;

        const adminCard = createCard(
            complaint.category,
            "Student: " + complaint.name +
            " | Location: " + complaint.location +
            " | Priority: " + complaint.priority +
            " | Problem: " + complaint.description
        );

        const label = document.createElement("label");
        label.textContent = "Update Status:";

        const select = document.createElement("select");

        ["Pending", "In Progress", "Resolved"].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        select.value = complaint.status;

        select.addEventListener("change", function () {
            complaints[index].status = select.value;
            saveData("complaints", complaints);
            displayComplaints();
        });

        adminCard.append(label, select);
        adminComplaintList.appendChild(adminCard);
    });

    if (filteredComplaints.length === 0) {
        adminComplaintList.textContent =
            "No matching complaints found.";
    }

    saveData("complaints", complaints);
}

// COMPLAINT SUBMISSION

form.addEventListener("submit", function (event) {
    event.preventDefault();

    complaints.push({
        name: document.getElementById("studentName").value,
        category: document.getElementById("category").value,
        location: document.getElementById("location").value,
        priority: document.getElementById("priority").value,
        description: document.getElementById("description").value,
        status: "Pending"
    });

    saveData("complaints", complaints);
    displayComplaints();
    form.reset();

    alert("Complaint submitted successfully!");
});

// SEARCH AND FILTER EVENTS

complaintSearch.addEventListener("input", displayComplaints);
priorityFilter.addEventListener("change", displayComplaints);
statusFilter.addEventListener("change", displayComplaints);

// ======================================
// ADMIN DASHBOARD
// ======================================

function toggleAdmin() {

    const panel = document.getElementById("adminPanel");

    panel.hidden = !panel.hidden;

    if (!panel.hidden) {

        displayComplaints();
        displayAnnouncements();

        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}



// ======================================
// SMART SCHOOL - AI LEARNING ASSISTANT
// ======================================

// Suggested question buttons
function useQuestion(question) {
    document.getElementById("learningQuestion").value = question;

    document.getElementById("learningAnswer").innerHTML =
        "<p>Question selected! Click Ask Question to get your answer.</p>";
}

// Answer questions
document.getElementById("askQuestion")
.addEventListener("click", function () {

    const question = document.getElementById("learningQuestion")
        .value.toLowerCase().trim();

    const answerBox = document.getElementById("learningAnswer");

    let answer = "";

    if (!question) {
        answer = "Please enter a question first.";
    }

    // SCIENCE
    else if (question.includes("photosynthesis")) {
        answer = "🌱 Photosynthesis is the process by which green plants prepare their own food using sunlight, water and carbon dioxide. Oxygen is released during this process.";
    }

    else if (question.includes("gravity")) {
        answer = "🌍 Gravity is the force of attraction between objects. Earth's gravity pulls objects towards its centre and keeps us on the ground.";
    }

    else if (question.includes("water cycle")) {
        answer = "💧 The water cycle is the continuous movement of water in nature. Its main stages are evaporation, condensation and precipitation.";
    }

    else if (question.includes("evaporation")) {
        answer = "☀️ Evaporation is the process in which liquid water changes into water vapour due to heat.";
    }

    else if (question.includes("condensation")) {
        answer = "☁️ Condensation is the process in which water vapour cools and changes into tiny liquid water droplets.";
    }

    // MATHEMATICS
    else if (question.includes("fraction")) {
        answer = "➗ A fraction represents a part of a whole. It has a numerator (top number) and denominator (bottom number). For example, 1/2 means one out of two equal parts.";
    }

    else if (question.includes("pythagoras")) {
        answer = "📐 Pythagoras' theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.";
    }

    // COMPUTERS
    else if (question.includes("computer")) {
        answer = "💻 A computer is an electronic device that accepts data, processes it and produces information.";
    }

    else if (question.includes("internet")) {
        answer = "🌐 The Internet is a worldwide network that connects computers and devices so they can exchange information.";
    }

    // GENERAL
    else if (question.includes("ai") || question.includes("artificial intelligence")) {
        answer = "🤖 Artificial Intelligence (AI) is a technology that allows computers to perform tasks that usually require human intelligence, such as understanding language and recognising patterns.";
    }

    else {
        answer = "📚 I don't have a prepared answer for that question yet. Try asking about photosynthesis, gravity, the water cycle, fractions, computers or AI!";
    }

    answerBox.replaceChildren(
        createCard("🤖 Learning Assistant", answer)
    );
});

// ======================================
// FEATURE 2: LOST AND FOUND
// ======================================

const lostFoundForm = document.getElementById("lostFoundForm");

function displayLostItems() {

    const list = document.getElementById("lostFoundList");
    list.replaceChildren();

    lostItems.forEach((item, index) => {

        const card = createCard(
            item.type + ": " + item.name,
            "Location: " + item.location
        );

        card.appendChild(createDeleteButton(function () {
            lostItems.splice(index, 1);
            saveData("lostItems", lostItems);
            displayLostItems();
        }));

        list.appendChild(card);
    });
}

lostFoundForm.addEventListener("submit", function (event) {
    event.preventDefault();

    lostItems.push({
        name: document.getElementById("itemName").value,
        type: document.getElementById("itemType").value,
        location: document.getElementById("itemLocation").value
    });

    saveData("lostItems", lostItems);
    displayLostItems();
    lostFoundForm.reset();

    alert("Lost and Found report submitted!");
});

// ======================================
// FEATURE 3: STUDENT SUGGESTION BOX
// ======================================

const suggestionForm = document.getElementById("suggestionForm");

function displaySuggestions() {

    const list = document.getElementById("suggestionList");
    list.replaceChildren();

    suggestions.forEach((suggestion, index) => {

        const card = createCard(
            "Suggestion " + (index + 1),
            suggestion
        );

        card.appendChild(createDeleteButton(function () {
            suggestions.splice(index, 1);
            saveData("suggestions", suggestions);
            displaySuggestions();
        }));

        list.appendChild(card);
    });
}

suggestionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const suggestion =
        document.getElementById("suggestionText").value;

    suggestions.push(suggestion);

    saveData("suggestions", suggestions);
    displaySuggestions();
    suggestionForm.reset();

    alert("Thank you for your suggestion!");
});

// ======================================
// FEATURE 4: SCHOOL ANNOUNCEMENTS
// ======================================

const announcementForm =
    document.getElementById("announcementForm");

function displayAnnouncements() {

    const list = document.getElementById("announcementList");
    list.replaceChildren();

    announcements.forEach((item, index) => {

        const card = createCard(item.title, item.message);

        card.appendChild(createDeleteButton(function () {
            announcements.splice(index, 1);
            saveData("announcements", announcements);
            displayAnnouncements();
        }));

        list.appendChild(card);
    });
}

announcementForm.addEventListener("submit", function (event) {
    event.preventDefault();

    announcements.push({
        title: document.getElementById("announcementTitle").value,
        message: document.getElementById("announcementMessage").value
    });

    saveData("announcements", announcements);
    displayAnnouncements();
    announcementForm.reset();

    alert("Announcement posted successfully!");
});

// ======================================
// FEATURE 5: ECO-SCHOOL TRACKER
// ======================================

function displayEcoActivities() {

    const list = document.getElementById("ecoActivityList");
    list.replaceChildren();

    document.getElementById("ecoPoints").textContent =
        ecoActivities.length;

    ecoActivities.forEach((activity, index) => {

        const card = createCard(
            "Eco Activity " + (index + 1),
            activity
        );

        card.appendChild(createDeleteButton(function () {
            ecoActivities.splice(index, 1);
            saveData("ecoActivities", ecoActivities);
            displayEcoActivities();
        }));

        list.appendChild(card);
    });
}

document.getElementById("ecoButton")
.addEventListener("click", function () {

    const activity =
        document.getElementById("ecoActivity").value;

    if (!activity) {
        alert("Please select an activity!");
        return;
    }

    ecoActivities.push(activity);

    saveData("ecoActivities", ecoActivities);
    displayEcoActivities();

    document.getElementById("ecoActivity").value = "";

    alert("Great job! You earned 1 Eco Point!");
});

// ======================================
// LOAD ALL SAVED INFORMATION
// ======================================

displayComplaints();
displayLostItems();
displaySuggestions();
displayAnnouncements();
displayEcoActivities();
