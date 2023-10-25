let elmEmailInput = document.getElementById("emailInput");
let elmNameInput = document.getElementById("nameInput");
let elmPhoneInput = document.getElementById("phoneInput");
let elmAddressInput = document.getElementById("addressInput");
let elmBtnUpdate = document.getElementById("btnUpdate");
let elmArletForm = document.getElementById("alertForm");
let elmUpdateForm = document.querySelector(".update-form");

// event
elmBtnUpdate.addEventListener("click", () => {
    updateInfo();
});

// event end

function updateInfo() {
    API_NEWS.put(
        UPDATE_CURRENT_USER_INFO,
        {
            name: elmNameInput.value,
            phone: elmPhoneInput.value,
            address: elmAddressInput.value,
        },
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        }
    )
        .then((response) => {
            alertForm("", true);
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
        str = "Cập nhật thành công !";
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
    elmUpdateForm.addEventListener("keydown", () => {
        if (flag) {
            elmArletForm.classList.add("d-none");
        }
        flag = false;
    });
}



getCurrentUser();

getCurrentUserInfo().then((response) => {
    const RES_DATA = response.data.data;
    elmEmailInput.value = RES_DATA.email;
    elmNameInput.value = RES_DATA.name;
    elmPhoneInput.value = RES_DATA.phone;
    elmAddressInput.value = RES_DATA.address;
});
