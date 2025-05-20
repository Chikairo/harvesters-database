let teamsData = []; // Will hold your teams from JSON or initial data

// Load teams from JSON file (or variable)
async function loadTeams() {
  // If from JSON file:
  const response = await fetch('data/attendance.json');
  const data = await response.json();
  teamsData = data.teams; // adjust as per your JSON structure

  populateTeamDropdown();
}

// Populate the "Add Department" team dropdown
function populateTeamDropdown() {
  const teamSelect = document.getElementById('team-select');
  teamSelect.innerHTML = '<option value="">-- Select Team --</option>'; // reset options

  teamsData.forEach(team => {
    const option = document.createElement('option');
    option.value = team.name.toLowerCase().replace(/\s+/g, '-'); // e.g. 'general-services'
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });
}

// When new team is added via form
function addNewTeamToData(newTeamName) {
  // Add new team to teamsData array
  const formattedName = newTeamName.toLowerCase().replace(/\s+/g, '-');
  const newTeamObj = {
    name: newTeamName,
    departments: []
  };
  teamsData.push(newTeamObj);

  // Update dropdown
  populateTeamDropdown();

  // Optionally select the newly added team automatically
  const teamSelect = document.getElementById('team-select');
  teamSelect.value = formattedName;
}

// Event listener for Add Team form submission
document.getElementById('add-team-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const newTeamName = document.getElementById('new-team-name').value.trim();
  if(newTeamName) {
    addNewTeamToData(newTeamName);
    alert(`Team "${newTeamName}" added successfully!`);
    this.reset();
    // Redirect to attendance page after alert OK
    window.location.href = 'attendance-card.html'; // change to your attendance page URL
  }
});

// Event listener for Add Department form submission
document.getElementById('add-department-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const teamSelected = document.getElementById('team-select').value;
  const deptName = document.getElementById('new-dept-name').value.trim();
  const presentCount = document.getElementById('present-count').value;
  const absentCount = document.getElementById('absent-count').value;

  if (teamSelected && deptName && presentCount !== '' && absentCount !== '') {
    // Find the team and add the new department
    const team = teamsData.find(t => t.name.toLowerCase().replace(/\s+/g, '-') === teamSelected);
    if (team) {
      team.departments.push({
        name: deptName,
        present: Number(presentCount),
        absent: Number(absentCount)
      });
    }

    alert(`Department "${deptName}" added successfully to "${teamSelected}"!`);
    this.reset();
    // Redirect to attendance page after alert OK
    window.location.href = 'attendance-card.html'; // change to your attendance page URL
  }
});

// Initial load
loadTeams();

// Hamburger menu toggle
function toggleMenu() {
  const menu = document.getElementById("menuOverlay");
  menu.classList.toggle("open");
}

// Members name at the top
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    const avatar = document.getElementById("userAvatar");
    avatar.textContent = firstLetter;
  }
});

// Logout
function confirmLogout() {
  const confirmed = confirm("Do you want to log out?");
  if (confirmed) {
    localStorage.removeItem("user"); // Clear stored login data
    window.location.href = "index.html"; // Redirect to login page
  }
}
