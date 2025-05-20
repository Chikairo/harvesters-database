let jsonData = null;

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/attendance.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load data.json");
      }
      return response.json();
    })
    .then((data) => {
      jsonData = data;
      initTeamNavigation();
      document.querySelector('[data-team="general-services"]').click();
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
    });
});

function initTeamNavigation() {
  const teamLinks = document.querySelectorAll(".team-navigation a");

  teamLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedTeam = this.dataset.team;

      // Update active link
      teamLinks.forEach((l) => l.classList.remove("active-team"));
      this.classList.add("active-team");

      // Hide all team sections
      document.querySelectorAll(".team-section").forEach((section) => {
        section.style.display = "none";
      });

      // Show selected team section
      const selectedSection = document.getElementById(
        `${selectedTeam}-attendance`
      );
      if (selectedSection) {
        selectedSection.style.display = "block";
      }

      // Only populate dropdown once
      populateDropdown(selectedTeam);
      populateTable(selectedTeam, "all");
    });
  });
}

function populateDropdown(teamKey) {
  if (!jsonData) return;

  const teamData = jsonData.teams.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, "-") === teamKey
  );
  if (!teamData) return;

  const select = document.querySelector(`#${teamKey}-dept`);
  if (!select) return;

  // Reset options
  select.innerHTML = `<option value="all">All Departments</option>`;
  teamData.departments.forEach((dept) => {
    const option = document.createElement("option");
    option.value = dept.name;
    option.textContent = dept.name;
    select.appendChild(option);
  });

  // Set change handler only once
  select.onchange = function () {
    populateTable(teamKey, this.value);
  };
}

function populateTable(teamKey, selectedDepartment = "all") {
  if (!jsonData) return;

  const teamData = jsonData.teams.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, "-") === teamKey
  );
  if (!teamData) return;

  const tbody = document.querySelector(`#${teamKey}-table tbody`);
  if (!tbody) return;

  // Clear table
  tbody.innerHTML = "";

  const departmentsToShow =
    selectedDepartment === "all"
      ? teamData.departments
      : teamData.departments.filter((dept) => dept.name === selectedDepartment);

  if (departmentsToShow.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5">No department data available.</td>`;
    tbody.appendChild(row);
    return;
  }

  departmentsToShow.forEach((dept) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dept.name}</td>
      <td>${dept.present}</td>
      <td>${dept.absent}</td>
      <td>${dept.total}</td>
      <td><button onclick="alert('Viewing members for ${dept.name}')">View</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Hamburger menu toggle
function toggleMenu() {
  const menu = document.getElementById("menuOverlay");
  menu.classList.toggle("open");
}


// members name at the top
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    const avatar = document.getElementById("userAvatar");
    avatar.textContent = firstLetter;
  }
});

//logout
function confirmLogout() {
  const confirmed = confirm("Do you want to log out?");
  if (confirmed) {
    localStorage.removeItem("user"); // Clear stored login data
    window.location.href = "index.html"; // Redirect to login page
  }
}

const modal = document.getElementById("form-modal");
const formContainer = document.getElementById("form-container");
const closeModal = document.getElementById("close-modal");
const attendanceContainer = document.getElementById("attendance-container");

// Show Modal
function showModal(contentHTML) {
  formContainer.innerHTML = contentHTML;
  modal.style.display = "flex";
  populateTeamDropdown();
}

// Hide Modal
function hideModal() {
  modal.style.display = "none";
}

// Add Team
document.getElementById("add-team-btn").addEventListener("click", () => {
  showModal(`
    <form id="team-form">
      <input type="text" id="team-name" placeholder="New Team Name" required />
      <button type="submit">Add Team</button>
    </form>
  `);
});

formContainer.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (e.target.id === "team-form") {
    const teamName = document.getElementById("team-name").value.trim();
    if (!attendanceData[teamName]) {
      attendanceData[teamName] = [];
      alert("Team added successfully.");
    }
    hideModal();
    renderAttendance();
  }

  if (e.target.id === "dept-form") {
    const team = document.getElementById("team-select").value;
    const deptName = document.getElementById("dept-name").value.trim();
    const present = parseInt(document.getElementById("present").value);
    const absent = parseInt(document.getElementById("absent").value);

    if (team && deptName) {
      attendanceData[team].push({ name: deptName, present, absent });
      alert("Department added successfully.");
      hideModal();
      renderAttendance();
    }
  }
});

// Add Department
document.getElementById("add-dept-btn").addEventListener("click", () => {
  showModal(`
    <form id="dept-form">
      <select id="team-select" required></select>
      <input type="text" id="dept-name" placeholder="Department Name" required />
      <input type="number" id="present" placeholder="Present" required min="0" />
      <input type="number" id="absent" placeholder="Absent" required min="0" />
      <button type="submit">Add Department</button>
    </form>
  `);
});

// Close modal
document.getElementById("close-modal").addEventListener("click", hideModal);

// Load data
fetchAttendanceData();

