// ========== Simpan dan Ambil Data User ==========
function saveUser(username, email, password, kode = "") {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user => user.username === username || user.email === email);
  if (userExists) return false;

  users.push({ username, email, password, kode, saldo: 0 });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function checkLogin(usernameOrEmail, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(user =>
    (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
    user.password === password
  );
}

function beriBonusReferral(kodeReferral) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const referer = users.find(user => user.kode === kodeReferral);
  if (referer) {
    referer.saldo = (referer.saldo || 0) + 50000;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// ========== Handle DOM ==========
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("register-username").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const kode = Math.random().toString(36).substring(2, 8); // kode unik otomatis
      const message = document.getElementById("register-message");

      if (!username || !email || !password) {
        message.style.color = "red";
        message.innerText = "Semua field harus diisi!";
        return;
      }

      if (saveUser(username, email, password, kode)) {
        message.style.color = "green";
        message.innerText = `Pendaftaran berhasil! Kode referral Anda: ${kode}`;
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

      const usernameOrEmail = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
      const kodeReferral = document.getElementById("referral-code").value.trim();
      const message = document.getElementById("login-message");

      const user = checkLogin(usernameOrEmail, password);
      if (user) {
        // Proses referral
        if (kodeReferral && kodeReferral !== user.kode) {
          beriBonusReferral(kodeReferral);
        }

        message.style.color = "green";
        message.innerText = "Login berhasil!";
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.innerText = "Username/email atau password salah!";
      }
    });
  }

  // ========== Proteksi Halaman Dashboard ==========
  const currentPage = window.location.pathname;
  if (currentPage.includes("dashboard.html")) {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      window.location.href = "index.html";
    }

    window.logout = function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    };
  }

  // ========== Isi Saldo (Dummy) ==========
  const isiForm = document.getElementById("isi-form");
  if (isiForm) {
    isiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const jumlah = document.getElementById("jumlah-isi").value;
      const metode = document.getElementById("metode-isi").value;
      const notif = document.getElementById("isi-message");

      notif.style.color = "green";
      notif.innerText = `Berhasil isi saldo Rp${jumlah} via ${metode}`;
    });
  }

  // ========== Tarik Saldo (Dummy) ==========
  const tarikForm = document.getElementById("tarik-form");
  if (tarikForm) {
    tarikForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const jumlah = document.getElementById("jumlah-tarik").value;
      const metode = document.getElementById("metode-tarik").value;
      const nomor = document.getElementById("nomor-tarik").value;
      const notif = document.getElementById("tarik-message");

      notif.style.color = "green";
      notif.innerText = `Berhasil tarik Rp${jumlah} ke ${nomor} via ${metode}`;
    });
  }
});
