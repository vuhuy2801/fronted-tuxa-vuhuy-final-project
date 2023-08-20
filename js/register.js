let elmEmailInput = document.getElementById("emailInput");
let elmNameInput = document.getElementById("nameInput");
let elmPassWordInput = document.getElementById("passWordInput");
let elmPhoneInput = document.getElementById("phoneInput");
let elmAddressInput = document.getElementById("addressInput");
let elmBtnRegister = document.getElementById("btnRegister");
let elmArletForm = document.getElementById("alertForm");
let elmRegisterForm = document.querySelector(".register-form");
let elmTogglePassword = document.getElementById("togglePassword");
// event
elmBtnRegister.addEventListener("click", () => {
  register();
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

function register() {
  API_NEWS.post(REGISTER, {
    name: elmNameInput.value,
    email: elmEmailInput.value,
    password: elmPassWordInput.value,
    phone: elmPhoneInput.value,
    address: elmAddressInput.value,
  })
    .then((response) => {
      login();
    })
    .catch((error) => {
      // console.log(error.response.data.errors);
      alertForm(error.response.data.errors);
    });
}

function alertForm(data) {
  let str = "";
  for (const property in data) {
    str += `${data[property]} <br>`;
  }
  elmArletForm.innerHTML = str;

  let flag = true;
  elmArletForm.classList.remove("d-none");
  // đặt flag để event thực hiện 1 lần
  elmRegisterForm.addEventListener("keydown", () => {
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
    });
}

function saveInfoLogin(data) {
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
