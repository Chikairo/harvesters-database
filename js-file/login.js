document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Clear previous errors
  clearErrors();

  let isValid = true;

  // Validate email
  if (!email) {
    showError("loginEmail", "Email is required.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("loginEmail", "Please enter a valid email address.");
    isValid = false;
  }

  // Validate password
  if (!password) {
    showError("loginPassword", "Password is required.");
    isValid = false;
  }

  if (!isValid) return;

  // Check credentials
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (
    !storedUser ||
    storedUser.email !== email ||
    storedUser.password !== password
  ) {
    showError("loginPassword", "Invalid email or password.");
    return;
  }

  alert(`Welcome back, ${storedUser.name}!`);
  window.location.href = 'members-card.html';
});

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  let error = document.createElement("div");
  error.className = "error";
  error.textContent = message;
  input.parentNode.insertBefore(error, input.nextSibling);
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((el) => el.remove());
}
