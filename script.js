// ========== Utility ==========
function generateKodeUnik() {
  return Math.random().toString(36).substring(2, 8);
}

// ========== Simpan dan Ambil Data User ==========
function saveUser(nomor, email, password, kode = "") {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(user =>
    user.nomor === nomor || user.email === email
  );
  if (userExists) return false;

  users.push({
    nomor,
    email,
    password,
    kode,
    saldo: 0,
    referralSaldo: 0
  });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function checkLogin(nomor, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(user =>
    user.nomor === nomor && user.password === password
  );
}

function beriBonusReferral(kodeReferral) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const referer = users.find(user => user.kode === kodeReferral);
  if (referer) {
    referer.referralSaldo = (referer.referralSaldo || 0) + 50000;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// ========== Handle DOM ==========
document.addEventListener("DOMContentLoaded", function () {
  // === REGISTER ===
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nomor = document.getElementById("register-nomor").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;
      const kode = generateKodeUnik();
      const message = document.getElementById("register-message");

      if (!nomor || !email || !password) {
        message.style.color = "red";
        message.innerText = "Semua field harus diisi!";
        return;
      }

      if (saveUser(nomor, email, password, kode)) {
        message.style.color = "green";
        message.innerText = `Pendaftaran berhasil! Kode referral Anda: ${kode}`;
        registerForm.reset();
      } else {
        message.style.color = "red";
        message.innerText = "Nomor atau Email sudah terdaftar!";
      }
    });
  }

  // === LOGIN ===
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nomor = document.getElementById("login-nomor").value.trim();
      const password = document.getElementById("login-password").value;
      const kodeReferral = document.getElementById("referral-code")?.value.trim() || "";
      const message = document.getElementById("login-message");

      const user = checkLogin(nomor, password);
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
        message.innerText = "Nomor atau password salah!";
      }
    });
  }

  // === Proteksi Dashboard ===
  const currentPage = window.location.pathname;
  if (currentPage.includes("dashboard.html")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      window.location.href = "index.html";
    } else {
      // Tampilkan saldo & referral
      const saldoElement = document.getElementById("user-saldo");
      const referralElement = document.getElementById("user-referral");

      if (saldoElement) saldoElement.innerText = `Rp${user.saldo}`;
      if (referralElement) referralElement.innerText = `Rp${user.referralSaldo}`;
    }

    window.logout = function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    };
  }

  // === Isi Saldo ===
  const isiForm = document.getElementById("isi-form");
  if (isiForm) {
    isiForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const jumlah = parseInt(document.getElementById("jumlah-isi").value);
      const metode = document.getElementById("metode-isi").value;
      const notif = document.getElementById("isi-message");

      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user) {
        user.saldo += jumlah;

        // Update ke users
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.nomor === user.nomor);
        if (index !== -1) users[index] = user;

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        notif.style.color = "green";
        notif.innerText = `Berhasil isi saldo Rp${jumlah} via ${metode}`;
      }
    });
  }

  // === Tarik Saldo ===
  const tarikForm = document.getElementById("tarik-form");
  if (tarikForm) {
    tarikForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const jumlah = parseInt(document.getElementById("jumlah-tarik").value);
      const metode = document.getElementById("metode-tarik").value;
      const nomor = document.getElementById("nomor-tarik").value;
      const notif = document.getElementById("tarik-message");

      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user && user.saldo >= jumlah) {
        user.saldo -= jumlah;

        // Update ke users
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.nomor === user.nomor);
        if (index !== -1) users[index] = user;

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        notif.style.color = "green";
        notif.innerText = `Berhasil tarik Rp${jumlah} ke ${nomor} via ${metode}`;
      } else {
        notif.style.color = "red";
        notif.innerText = "Saldo tidak cukup!";
      }
    });
  }
});
