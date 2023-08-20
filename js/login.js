let elmEmailInput = document.getElementById("emailInput");
let elmPassWordInput = document.getElementById("passWordInput");
let elmIsRemember = document.getElementById("isRemember");
let elmBtnLogin = document.getElementById("btnLogin");
let elmArletForm = document.getElementById("alertForm");
let elmLoginForm = document.querySelector(".login-form");
let elmTogglePassword = document.getElementById("togglePassword");

const CURRENT_LOGIN_INFO = JSON.parse(localStorage.getItem("currentLogin"));

// event
elmBtnLogin.addEventListener("click", () => {
  login();
});

//  hide/show password
elmTogglePassword.addEventListener("click", () => {
  const type =
    elmPassWordInput.getAttribute("type") === "password" ? "text" : "password";
  elmPassWordInput.setAttribute("type", type);

  elmTogglePassword.classList.toggle("fa-eye-slash");
  elmTogglePassword.classList.toggle("fa-eye");
});

// event end

function autoFillForm() {
  if (CURRENT_LOGIN_INFO) {
    elmEmailInput.value = CURRENT_LOGIN_INFO.email;
    elmPassWordInput.value = CURRENT_LOGIN_INFO.password;
  }
}

function alertForm() {
  let flag = true;
  elmArletForm.classList.remove("d-none");
  // đặt flag để event thực hiện 1 lần
  elmLoginForm.addEventListener("keydown", () => {
    if (flag) {
      elmArletForm.classList.add("d-none");
    }
    flag = false;
  });
}

function login() {
  API_NEWS.post(LOGIN, {
    email: elmEmailInput.value,
    password: elmPassWordInput.value,
  })
    .then((response) => {
      saveInfoLogin(response.data.access_token);
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.log(error);
      alertForm();
    });
}

function saveInfoLogin(data) {
  if (elmIsRemember.checked) {
    // save info login
    localStorage.setItem(
      "currentLogin",
      JSON.stringify({
        email: elmEmailInput.value,
        password: elmPassWordInput.value,
      })
    );
  } else {
    localStorage.removeItem("currentLogin");
  }
  localStorage.setItem("ACCESS_TOKEN", JSON.stringify(data)); // save token user
}

function getCurrentUser() {
  API_NEWS.get(CURRENT_USER_INFO, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  })
    .then((response) => {
      window.location.href = "/index.html";
    })
    .catch((error) => {});
}

getCurrentUser();
autoFillForm();
