const urlBase = "http://localhost:8080/LAMPAPI/";
const loginUrlBase = "http://localhost:8080/contact/";

async function fetchJSON(path, opts = {}) {
  const res = await fetch(urlBase + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: opts.body ? JSON.stringify(opts.body) : "{}",
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { status: "failure", raw: text }; }
}

function setText(id, msg) {
  const el = document.getElementById(id);
  if (el) el.innerText = msg || "";
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function showRegister() {
  hide("loginDiv");
  show("registerDiv");
  setText("loginResult", "");
  setText("registerResult", "");
}

function showLogin() {
  show("loginDiv");
  hide("registerDiv");
  setText("loginResult", "");
  setText("registerResult", "");
}

async function doLogin() {
  const login = (document.getElementById("userLogin")?.value || "").trim();
  const password = document.getElementById("userPassword")?.value || "";
  if (!login || !password) { setText("loginResult", "Please enter username and password."); return; }
  const data = await fetchJSON("Login.php", { body: { login, password } });
  if (data?.status === "success") {
    window.location.href = loginUrlBase + "contact.php";
  } else {
    setText("loginResult", "Invalid credentials.");
  }
}

async function doRegistration() {
  const firstname = (document.getElementById("newFirstName")?.value || "").trim();
  const lastname = (document.getElementById("newLastName")?.value || "").trim();
  const login = (document.getElementById("newUser")?.value || "").trim();
  const password = document.getElementById("newPass")?.value || "";
  if (!firstname || !lastname || !login || !password) { setText("registerResult", "Please fill out all fields."); return; }
  const data = await fetchJSON("Register.php", { body: { firstname, lastname, login, password } });
  if (data?.status === "success" || data?.message?.toLowerCase?.().includes("success")) {
    setText("registerResult", "Account created. You can now log in.");
    showLogin();
    const u = document.getElementById("userLogin");
    const p = document.getElementById("userPassword");
    if (u) u.value = login;
    if (p) p.value = password;
  } else {
    setText("registerResult", "Registration failed.");
  }
}

async function doLogout() {
  try { await fetchJSON("Logout.php", { body: {} }); } catch {}
  window.location.href = "http://localhost:8080/";
}

async function addContactDemo(firstname, lastname, phone, email) {
  return await fetchJSON("Add_Contact.php", { body: { firstname, lastname, phone, email } });
}

async function searchContactsDemo(term = "") {
  return await fetchJSON("Search_Contacts.php", { body: { search: term } });
}

window.addEventListener("DOMContentLoaded", () => {
  showLogin();
  const loginBtn = document.querySelector('button.primary[onclick="doLogin()"]');
  const regBtn = document.querySelector('button.primary[onclick="doRegistration()"]');
  if (loginBtn) loginBtn.addEventListener("click", (e) => { e.preventDefault?.(); doLogin(); });
  if (regBtn) regBtn.addEventListener("click", (e) => { e.preventDefault?.(); doRegistration(); });
});
