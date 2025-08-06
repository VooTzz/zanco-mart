// Simpan dan ambil data user dari localStorage
function saveUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) return false; // Username sudah terdaftar
  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function checkLogin(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[username] === password;
}

// Handle Register (di register.html)
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const message = document.getElementById("register-message");

    if (saveUser(username, password)) {
      message.style.color = "green";
      message.innerText = "Pendaftaran berhasil! Silakan login.";
    } else {
      message.style.color = "red";
      message.innerText = "Username sudah terdaftar!";
    }
  });
}

// Handle Login (di index.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    if (checkLogin(username, password)) {
      message.style.color = "green";
      message.innerText = "Login berhasil!";

      // Simpan status login
      localStorage.setItem("loggedInUser", username);

      // Redirect ke dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.style.color = "red";
      message.innerText = "Username atau password salah!";
    }
  });
}

// Proteksi halaman dashboard (di dashboard.html)
const currentPage = window.location.pathname;

if (currentPage.includes("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    // Jika belum login, kembalikan ke halaman login
    window.location.href = "index.html";
  }

  // Logout function
  window.logout = function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  };
}
