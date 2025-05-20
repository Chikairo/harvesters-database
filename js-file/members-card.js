//member details
document.addEventListener("DOMContentLoaded", function () {
  let peopleData = [];
  const searchInput = document.getElementById("search");
  const resultsList = document.getElementById("results");

  if (!searchInput || !resultsList) return;

  fetch("data/members.json")
    .then((res) => res.json())
    .then((data) => {
      peopleData = data;

      searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        resultsList.innerHTML = "";

        if (query === "") {
          resultsList.style.display = "none";
          return;
        }

        const filtered = peopleData.filter((person) =>
          person.name.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
          filtered.forEach((person) => {
            const li = document.createElement("li");
            li.textContent = person.name;
            li.onclick = () => {
              const encodedName = encodeURIComponent(person.name);
              window.location.href = `members-card.html?name=${encodedName}`;
            };
            resultsList.appendChild(li);
          });
          resultsList.style.display = "block";
        } else {
          const li = document.createElement("li");
          li.textContent = "No matches found.";
          li.style.fontStyle = "italic";
          resultsList.appendChild(li);
          resultsList.style.display = "block";
        }
      });
    })
    .catch((error) => console.error("Error loading details.json:", error));
});

// card details
document.addEventListener("DOMContentLoaded", function () {
  const detailsBox = document.getElementById("personDetails");

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const personName = decodeURIComponent(getQueryParam("name") || "").trim();

  if (!personName) return;

  fetch("data/members.json")
    .then((res) => res.json())
    .then((data) => {
      const person = data.find((p) => p.name === personName);
      if (person) {
        detailsBox.style.display = "grid";
        detailsBox.classList.add("grid-layout");
        detailsBox.innerHTML = `
         <div class="detail-group a">
         <img src="images/cards/user.png" alt="img">
         <h3>Name</h3>
         <p> ${person.name}</p>
         </div>

          <div class="detail-group b">
           <img src="images/cards/contact-us.png" alt="img">
             <h3> Email</h3>
             <p> ${person.email}</p>
            <h3> Phone number</h3>
            <p>${person.contact}</p>
             <h3> Address</h3>
             <p> ${person.address}</p>
          </div>

          <div class="detail-group c">
           <img src="images/cards/growth.png" alt="img">
            <h3>Completed Growth Track</h3>
            <p> ${person.growth_track}</p>
          </div>

          <div class="detail-group" >
          <a href="graph.html" target="_blank" >
            <img src="images/cards/calendar.png" alt="img">
            <div class="attendance-box">
              <div class="attendance-item">
                <h3>Attendance this month</h3>
                <p>${person.attendance}</p>
              </div>
              <div class="attendance-item">
                <h3>Attendance this year</h3>
                <p>${person.yearlyattendance}</p>
              </div>
            </div>
            <p><strong>Date of joining the church:</strong>${person.date}</p>
            </a>
          <div>   
          `;
      } else {
        showError("Person not found.");
      }
    })
    .catch((error) => {
      console.error("Error loading details:", error);
      showError("Error loading details.");
    });

  function showError(message) {
    detailsBox.style.display = "block";
    detailsBox.classList.remove("grid-layout");
    detailsBox.innerHTML = `<div class="error-box">${message}</div>`;
  }
});

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

