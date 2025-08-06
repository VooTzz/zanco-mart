// Simpan dan ambil data dari localStorage
function saveUser(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) return false;
  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function checkLogin(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[username] === password;
}

// Handle register
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

// Handle login
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
      // Arahkan ke halaman dashboard misalnya
      // window.location.href = "dashboard.html";
    } else {
      message.style.color = "red";
      message.innerText = "Username atau password salah!";
    }
  });
}
