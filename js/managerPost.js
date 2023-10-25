let elmPostList = document.querySelector("#postList");
let elmloadingPost = document.querySelector("#loadingPost");

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

function editArticle(articleId) {
    console.log("sửa bài viết" + articleId);
    // Thực hiện sửa bài viết với ID là articleId
    // Ví dụ: hiển thị form sửa bài viết và điền dữ liệu cũ
}

function deleteArticle(articleId, e) {
    let divElement = e.closest("tr");
    if (confirm("bạn có chắc muốn xóa bài viết " + articleId)) {
        API_NEWS.delete(POST + articleId, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        })
            .then((response) => {
                notiStatus(`Xóa bài viết ${articleId} thành công!`, true);
                divElement.remove();
            })
            .catch((error) => {
                console.log(error);
                notiStatus(`Xóa bài viết ${articleId} thất bại!`, false);
            });
    }
}

function changeCategoryArticle(articleId, e) {
    console.log(e.value);
    API_NEWS.patch(POST + articleId, `category_id=${e.value}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    })
        .then((response) => {
            notiStatus(
                `Thay đổi danh mục bài viết ${articleId} thành công!`,
                true
            );
        })
        .catch((error) => {
            console.log(error);
            notiStatus(
                `Thay đổi danh mục bài viết ${articleId} thất bại!`,
                false
            );
        });
}

function setViewArticle(articleId, e) {
    API_NEWS.patch(POST + articleId, `status=${e.checked ? 1 : 0}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    })
        .then((response) => {
            notiStatus(
                e.checked
                    ? "Đã hiển thị bài viết " + articleId
                    : "Đã ẩn bài viết " + articleId,
                true
            );
        })
        .catch((error) => {
            console.log(error);
            notiStatus(
                e.checked
                    ? "Lỗi hiển thị bài viết " + articleId
                    : "Lỗi ẩn bài viết " + articleId,
                true
            );
        });

    console.log(
        e.checked ? "Hiển thị bài viết" + articleId : "Ẩn bài viết " + articleId
    );
    // Thực hiện xóa bài viết với ID là articleId
    // Ví dụ: hiển thị xác nhận trước khi xóa và gửi yêu cầu xóa đến máy chủ
}

function getPostList() {
    API_NEWS.get(MY_POSTS, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    })
        .then((response) => {
            renderPostList(response.data.data);
            elmloadingPost.remove();
        })
        .catch((error) => {
            console.log(error);
        });
}

function renderPostList(data) {
    let categorys = [
        {
            value: 1,
            name: "Thế Giới",
        },
        {
            value: 2,
            name: "Thời Sự",
        },
        {
            value: 3,
            name: "Kinh Doanh",
        },
        {
            value: 5,
            name: "Giải Trí",
        },
        {
            value: 6,
            name: "Thể Thao",
        },
        {
            value: 7,
            name: "Pháp Luật",
        },
        {
            value: 8,
            name: "Giáo Dục",
        },
        {
            value: 9,
            name: "Sức Khỏe",
        },
        {
            value: 10,
            name: "Đời Sống",
        },
        {
            value: 11,
            name: "Du Lịch",
        },
        {
            value: 12,
            name: "Khoa Học",
        },
        {
            value: 13,
            name: "Số Hóa",
        },
        {
            value: 14,
            name: "Xe",
        },
    ];
    let str = "";
    let selectItems = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < categorys.length; j++) {
            selectItems += `
            <option value="${categorys[j].value}" ${
                parseInt(data[i].category_id) === categorys[j].value
                    ? "selected"
                    : ""
            }>
            ${categorys[j].name}
            </option>
        `;
        }

        str += ` 
      <tr>
      <td
          class="image align-middle"
          scope="row"
      >
          ${data[i].id}
      </td>
      <td class="image align-middle">
          <img
              src="${data[i].thumb}"
              alt="${data[i].thumb}"
              width="100"
              height="100"
          />
      </td>
      <td class="item title align-middle">
      ${data[i].title}
      </td>
      <td class="align-middle">
          <select class="form-control" onchange="changeCategoryArticle(${
              data[i].id
          } ,this)">
          ${selectItems}
          </select>
      </td>
      <td class="align-middle text-center">
          <input
          class="checkBoxDisplay"
              type="checkbox"
              ${parseInt(data[i].status) === 0 ? "" : "checked"}
              onclick="setViewArticle(${data[i].id}, this)"
          />
      </td>
      <td class="align-middle text-center">
          <div>
          <a href="single-blog.html?id=3906">
              <button
                  type="button"
                  class="btn-custom btn-primary"
              >
             Xem
                  
              </button>
              </a>
              <button
                  type="button"
                  class="btn-custom btn-success"
                  onclick="editArticle(${data[i].id})"
              >
                  Sửa
              </button>
              <button
                  type="button"
                  class="btn-custom btn-danger"
                  onclick="deleteArticle(${data[i].id}, this)"
              >
                  Xóa
              </button>
          </div>
      </td>
  </tr>`;
    }
    elmPostList.innerHTML = str;
}

getPostList();

getCurrentUser();