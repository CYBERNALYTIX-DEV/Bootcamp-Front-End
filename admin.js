// Admin password
const ADMIN_PASSWORD = "admin2025";

// DOM elements
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");
const totalUsersSpan = document.getElementById("total-users");
const usersTable = document.getElementById("users-table");
const usersTbody = document.getElementById("users-tbody");
const usersContainer = document.getElementById("users-container");
const noUsersDiv = document.getElementById("no-users");
const loadingDiv = document.getElementById("loading");
const userModal = document.getElementById("user-modal");
const closeModal = document.getElementById("close-modal");
const modalBody = document.getElementById("modal-body");

// Check if admin is already logged in
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    showDashboard();
    loadUsers();
  }
});

// Login form handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = passwordInput.value.trim();

  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminLoggedIn", "true");
    showDashboard();
    loadUsers();
    loginError.style.display = "none";
    passwordInput.value = "";
  } else {
    loginError.textContent = "Invalid password! Please try again.";
    loginError.style.display = "block";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// Logout handler
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("adminLoggedIn");
  showLogin();
  clearUsersData();
});

// Refresh handler
refreshBtn.addEventListener("click", () => {
  loadUsers();
});

// Modal handlers
closeModal.addEventListener("click", () => {
  userModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === userModal) {
    userModal.style.display = "none";
  }
});

// Show login section
function showLogin() {
  loginSection.style.display = "flex";
  dashboardSection.style.display = "none";
  passwordInput.focus();
}

// Show dashboard section
function showDashboard() {
  loginSection.style.display = "none";
  dashboardSection.style.display = "block";
}

// Clear users data
function clearUsersData() {
  usersTbody.innerHTML = "";
  totalUsersSpan.textContent = "Total Applicants: 0";
  usersContainer.style.display = "none";
  noUsersDiv.style.display = "none";
}

// Load users from API
async function loadUsers() {
  try {
    loadingDiv.style.display = "block";
    usersContainer.style.display = "none";
    noUsersDiv.style.display = "none";

    const response = await fetch(
      "https://bootcamp-backend-t96p.onrender.com/users"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const users = result.data || [];

    loadingDiv.style.display = "none";

    if (users.length === 0) {
      noUsersDiv.style.display = "block";
      totalUsersSpan.textContent = "Total Applicants: 0";
    } else {
      displayUsers(users);
      totalUsersSpan.textContent = `Total Applicants: ${users.length}`;
    }
  } catch (error) {
    console.error("Error occured while loading:", error);
    loadingDiv.style.display = "none";
    alert(
      "Failed to load Applicants! Please check your connection and try again."
    );
  }
}

// Display users in table
function displayUsers(users) {
  usersTbody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td title="${user.fullName}">${user.fullName}</td>
            <td title="${user.email}">${user.email}</td>
            <td title="${user.tel}">${user.tel}</td>
            <td title="${user.gender}">${user.gender}</td>
            <td title="${user.residence}">${user.residence}</td>
            <td title="${user.currentEngagement}">${user.currentEngagement}</td>
            <td title="${user.currentField}">${user.currentField}</td>
            <td title="${user.proficiency}">${user.proficiency}</td>
            <td title="${user.hasExperience}">${user.hasExperience}</td>
            <td title="${user.referer}">${user.referer}</td>
            <td title="${user.session}">${user.session}</td>
            <td title="${user.certificate}">${user.certificate}</td>
            <td title="${formatDate(user.createdAt)}">${formatDate(
      user.createdAt
    )}</td>
            <td>
                <button class="view-btn" onclick="viewUser('${
                  user._id
                }')">View Details</button>
            </td>
        `;
    usersTbody.appendChild(row);
  });

  usersContainer.style.display = "block";
}

// View user details in modal
async function viewUser(userId) {
  try {
    const response = await fetch(
      `https://bootcamp-backend-t96p.onrender.com/users/${userId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const user = result.data;

    showUserDetails(user);
  } catch (error) {
    console.error("Error loading user details:", error);
    alert("Failed to load user details. Please try again.");
  }
}

// Show user details in modal
function showUserDetails(user) {
  modalBody.innerHTML = `
        <div class="user-detail">
            <label>Full Name:</label>
            <p>${user.fullName}</p>
        </div>
        <div class="user-detail">
            <label>Email:</label>
            <p>${user.email}</p>
        </div>
        <div class="user-detail">
            <label>Phone Number:</label>
            <p>${user.tel}</p>
        </div>
        <div class="user-detail">
            <label>Gender:</label>
            <p>${user.gender}</p>
        </div>
        <div class="user-detail">
            <label>Country of Residence:</label>
            <p>${user.residence}</p>
        </div>
        <div class="user-detail">
            <label>Current Engagement:</label>
            <p>${user.currentEngagement}</p>
        </div>
        <div class="user-detail">
            <label>Current Field/Industry:</label>
            <p>${user.currentField}</p>
        </div>
        <div class="user-detail">
            <label>IT/Computer Proficiency:</label>
            <p>${user.proficiency}</p>
        </div>
        <div class="user-detail long-text">
            <label>Motivation:</label>
            <p>${user.motivation}</p>
        </div>
        <div class="user-detail long-text">
            <label>Goals/Expectations:</label>
            <p>${user.expectation}</p>
        </div>
        <div class="user-detail">
            <label>Has Previous Experience:</label>
            <p>${user.hasExperience}</p>
        </div>
        ${
          user.experience
            ? `
        <div class="user-detail long-text">
            <label>Experience Details:</label>
            <p>${user.experience}</p>
        </div>
        `
            : ""
        }
        <div class="user-detail">
            <label>How they heard about bootcamp:</label>
            <p>${user.referer}</p>
        </div>
        <div class="user-detail">
            <label>Time Commitment:</label>
            <p>${user.session}</p>
        </div>
        <div class="user-detail">
            <label>Certificate Interest:</label>
            <p>${user.certificate}</p>
        </div>
        <div class="user-detail">
            <label>Registration Date:</label>
            <p>${formatDate(user.createdAt)}</p>
        </div>
    `;

  userModal.style.display = "flex";
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Make viewUser function global so it can be called from onclick
window.viewUser = viewUser;
