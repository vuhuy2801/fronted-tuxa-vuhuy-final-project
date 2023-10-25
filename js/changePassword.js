let elmOldPassWordInput = document.getElementById("oldPassWordInput");
let elmNewPassWordInput = document.getElementById("newPassWordInput");
let elmReNewpassWordInput = document.getElementById("reNewpassWordInput");
let elmBtnUpdate = document.getElementById("btnUpdate");
let elmArletForm = document.getElementById("alertForm");
let elmChangepwForm = document.querySelector(".changepw-form");

// event
elmBtnUpdate.addEventListener("click", () => {
  changePassword();
});

//  hide/show password
elmChangepwForm.addEventListener("click", function (e) {
  if (e.target.tagName === "I") {
    const ID_BTN_I = e.target.id;
    const INPUT_ELEMENT =
      ID_BTN_I === "togglePasswordOne"
        ? elmOldPassWordInput
        : ID_BTN_I === "togglePasswordTwo"
        ? elmNewPassWordInput
        : elmReNewpassWordInput;

    const type =
      INPUT_ELEMENT.getAttribute("type") === "password" ? "text" : "password";
    INPUT_ELEMENT.setAttribute("type", type);

    e.target.classList.toggle("fa-eye-slash");
    e.target.classList.toggle("fa-eye");
  }
});

// event end

function changePassword() {
  API_NEWS.put(
    CHANGE_PASSWORD,
    {
      password_current: elmOldPassWordInput.value,
      password: elmNewPassWordInput.value,
      password_confirmation: elmReNewpassWordInput.value,
    },
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  )
    .then((response) => {
      alertForm("", true);
      elmOldPassWordInput.value = "";
      elmNewPassWordInput.value = "";
      elmReNewpassWordInput.value = "";
    })
    .catch((error) => {
      console.log(error);
      alertForm(error.response.data.errors);
    });
}

function alertForm(data, status) {
  let str = "";
  if (status) {
    // thay đổi màu thông báo
    str = "Thay đổi mật khẩu thành công!";
    elmArletForm.classList.remove("alert-danger");
    elmArletForm.classList.add("alert-success");
  } else {
    for (const property in data) {
      str += `${data[property]} <br>`;
    }
  }
  elmArletForm.innerHTML = str;

  let flag = true;
  elmArletForm.classList.remove("d-none");
  // đặt flag để event thực hiện 1 lần
  elmChangepwForm.addEventListener("keydown", () => {
    if (flag) {
      elmArletForm.classList.add("d-none");
    }
    flag = false;
  });
}


getCurrentUser();
