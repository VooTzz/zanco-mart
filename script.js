// ========== Simpan dan Ambil Data User ==========
function saveUser(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.username === username || user.email === email);
  if (userExists) return false;

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function checkLogin(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(user => user.username === username && user.password === password);
}

// ========== Handle Register ==========
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const message = document.getElementById("register-message");

    if (!username || !email || !password) {
      message.style.color = "red";
      message.innerText = "Semua field harus diisi!";
      return;
    }

    if (saveUser(username, email, password)) {
      message.style.color = "green";
      message.innerText = "Pendaftaran berhasil! Silakan login.";
      registerForm.reset();
    } else {
      message.style.color = "red";
      message.innerText = "Username atau Email sudah terdaftar!";
    }
  });
}

// ========== Handle Login ==========
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    const user = checkLogin(username, password);
    if (user) {
      message.style.color = "green";
      message.innerText = "Login berhasil!";
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.style.color = "red";
      message.innerText = "Username atau password salah!";
    }
  });
}

// ========== Proteksi Halaman ==========
const currentPage = window.location.pathname;
if (currentPage.includes("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "index.html";

  window.logout = function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  };
}

// ========== Handle Isi Saldo ==========
const isiForm = document.getElementById("isi-form");
if (isiForm) {
  isiForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const jumlah = document.getElementById("jumlah-isi").value;
    const metode = document.getElementById("metode-isi").value;
    const notif = document.getElementById("isi-message");

    const data = {
      jumlah,
      metode,
      tujuan: "085812345678" // Ganti sesuai kebutuhan
    };

    fetch("https://api-kamu.com/isi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        notif.style.color = "green";
        notif.innerText = "Berhasil isi saldo: " + res.message;
      })
      .catch(err => {
        notif.style.color = "red";
        notif.innerText = "Gagal isi saldo: " + err.message;
      });
  });
}

// ========== Handle Tarik Saldo ==========
const tarikForm = document.getElementById("tarik-form");
if (tarikForm) {
  tarikForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const jumlah = document.getElementById("jumlah-tarik").value;
    const metode = document.getElementById("metode-tarik").value;
    const nomor = document.getElementById("nomor-tarik").value;
    const notif = document.getElementById("tarik-message");

    const data = { jumlah, metode, nomor };

    fetch("https://api-kamu.com/tarik", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(res => {
        notif.style.color = "green";
        notif.innerText = "Berhasil tarik: " + res.message;
      })
      .catch(err => {
        notif.style.color = "red";
        notif.innerText = "Gagal tarik: " + err.message;
      });
  });
                 }
