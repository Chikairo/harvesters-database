
// SignUp menu toggle
function toggleSignUpMenu() {
  const menu = document.getElementById("signupMenu");
  const arrow = document.getElementById("dropdownArrow");
  
  menu.classList.toggle("show");
  arrow.classList.toggle("rotate");
}

window.onclick = function(event) {
  const menu = document.getElementById("signupMenu");
  const arrow = document.getElementById("dropdownArrow");

  if (!event.target.matches('.dropdown-toggle')) {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      arrow.classList.remove('rotate');
    }
  }
};


// Hamburger menu toggle
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.height = menu.style.height === "100%" ? "0" : "100%";
}