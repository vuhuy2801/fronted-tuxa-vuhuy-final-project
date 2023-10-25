let elmImagePreview = document.querySelector(".img-preview");
let elmPictureUrlInput = document.querySelector("#pictureUrlInput");
let elmBtnRandomImg = document.querySelector("#btnRandomImg");
let elmCategoriInput = document.querySelector("#categoriInput");
let elmTitleInput = document.querySelector("#titleInput");
let elmDescriptionInput = document.querySelector("#descriptionInput");
let elmContentInput = document.querySelector("#contentInput");
let elmBtnCreate = document.querySelector("#btnCreate");
// let elmCreatePostForm = document.querySelector("#createPostForm");
let editor;

let formData = {
    title: "",
    description: "",
    content: "",
    thumb: "",
    category_id: 1,
};

function setFormCreatePost(
    srcImagePreview,
    urlInput,
    titleInput,
    descriptionInput,
    contenInput,
    categoriInput
) {
    elmImagePreview.innerHTML = `<img src="${srcImagePreview}" alt="">`;
    elmPictureUrlInput.value = urlInput;
    elmTitleInput.value = titleInput;
    elmCategoriInput.value = categoriInput;
    elmDescriptionInput.value = descriptionInput;
    editor.setData(contenInput);
}

ClassicEditor.create(document.querySelector("textarea"))
    .then((newEditor) => {
        editor = newEditor;
    })
    .catch((error) => {
        console.error(error);
    });

elmPictureUrlInput.addEventListener("change", () => {
    elmImagePreview.innerHTML = `<img src="${elmPictureUrlInput.value}" alt="">`;
});

function setLoadingBtnRandomImg(isLoading) {
    if (isLoading) {
        elmBtnRandomImg.classList.add("loading");
    } else {
        elmBtnRandomImg.classList.remove("loading");
    }
}

elmBtnRandomImg.addEventListener("click", () => {
    setLoadingBtnRandomImg(true);
    axios
        .get("https://source.unsplash.com/random/1920x1080/?cat", {
            responseType: "arraybuffer",
        })
        .then((response) => {
            setLoadingBtnRandomImg(false);
            const objectURL = URL.createObjectURL(new Blob([response.data]));
            elmImagePreview.innerHTML = `<img src="${objectURL}" alt="">`;
            elmPictureUrlInput.value = response.request.responseURL;
        });
});

elmBtnCreate.addEventListener("click", (e) => {
    e.preventDefault();
    if (getFormData()) {
        handleCreatePost();
        setLoadingCreatePost(true);
    }
});

function handleCreatePost() {
    API_NEWS.post(CREATE_POST, formData, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    })
        .then((response) => {
            notiStatus("thêm bài viết thành công", true);
            setLoadingCreatePost(false);
            setFormCreatePost("images/icon-img.png", "", "", "", "", "");
        })
        .catch((error) => {
            console.log(error);
            notiStatus("lỗi thêm bài viết", false);
            setLoadingCreatePost(false);
        });
}

function setLoadingCreatePost(isLoading) {
    if (isLoading) {
        elmBtnCreate.textContent = "Đang thêm...";
        elmBtnCreate.disabled = true;
    } else {
        elmBtnCreate.textContent = "Thêm bài viết";
        elmBtnCreate.disabled = false;
    }
}

function notiStatus(text, status) {
    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            color: status ? "#155724" : "#721c24",
            background: status ? "#d4edda" : "#f8d7da",
        },
        onClick: function () {}, // Callback after click
    }).showToast();
}

function getFormData() {
    if (!elmPictureUrlInput.value) {
        notiStatus("Vui lòng chọn ảnh cho bài viết", false);
        return false;
    }
    if (!elmTitleInput.value) {
        notiStatus("Vui lòng nhập tiêu đề cho bài viết", false);
        return false;
    }
    if (!elmCategoriInput.value) {
        notiStatus("Vui lòng chọn danh mục cho bài viết", false);
        return false;
    }
    if (!elmDescriptionInput.value) {
        notiStatus("Vui lòng nhập mô tả cho bài viết", false);
        return false;
    }
    if (!editor.getData()) {
        notiStatus("Vui lòng nhập nội dung cho bài viết", false);
        return false;
    }
    formData.thumb = elmPictureUrlInput.value;
    formData.title = elmTitleInput.value;
    formData.category_id = elmCategoriInput.value;
    formData.description = elmDescriptionInput.value;
    formData.content = editor.getData();
    return true;
}

getCurrentUser();
