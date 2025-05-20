document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Input fields
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Clear all previous errors
  clearErrors();

  let isValid = true;

  // Validate name
  if (!name) {
    showError("name", "Full name is required.");
    isValid = false;
  }

  // Validate email
  if (!email) {
    showError("email", "Email is required.");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  // Validate password
  if (!password) {
    showError("password", "Password is required.");
    isValid = false;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    isValid = false;
  }

  // Validate confirm password
  if (!confirmPassword) {
    showError("confirmPassword", "Please confirm your password.");
    isValid = false;
  } else if (password !== confirmPassword) {
    showError("confirmPassword", "Passwords do not match.");
    isValid = false;
  }

  if (isValid) {
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration successful!");
    window.location.href = "members-card.html";
  }
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
