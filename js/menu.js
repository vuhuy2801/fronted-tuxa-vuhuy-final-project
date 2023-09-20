let elmNavigation = document.querySelector("#navigation");
let elmSearch = document.querySelector(".search-box form");
let inputSearch = document.querySelector(".search-box form input");

// search start
elmSearch.addEventListener("submit", () => {
    event.preventDefault();
    window.location.href =
        "/search.html?keyword=" +
        encodeURIComponent(inputSearch.value) +
        "&page=1";
});

// start call api & render navigation
function getNavigation() {
    return API_NEWS.get(CATE_GET_ALL_API)
        .then((response) => {
            renderNavigation(response.data.data);
            /* 2. slick Nav */
            // mobile_menu
            var menu = $("ul#navigation");
            if (menu.length) {
                menu.slicknav({
                    prependTo: ".mobile_menu",
                    closedSymbol: "+",
                    openedSymbol: "-",
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


function renderNavigation(data) {
    let strMenu = `<li><a href="index.html">Trang chủ</a></li>`;
    let strSubMenu = "";
    if (data.length !== 4) {
        strSubMenu = `<li><a href="#">Tin Khác</a><ul class="submenu">`;
    }
    for (let i = 0; i < data.length; i++) {
        if (i < 4) {
            strMenu += `<li><a href="categori.html?id=${data[i].id}&page=1">${data[i].name}</a></li>`; // main menu
        } else {
            strSubMenu += `<li><a href="categori.html?id=${data[i].id}&page=1">${data[i].name}</a></li>`; // sub menu
        }
    }
    strSubMenu += `</ul>   
    </li>
    <li><a href="favorite.html" class="favoriteNav">Bài viết yêu thích</a></li>
    `;
    elmNavigation.innerHTML = strMenu + strSubMenu;
}
function renderCurrentUserInfo(status, data) {
    let str = "";
    if (status) {
        str = `
    <li><a href="#">${data.name}</a>
    <ul class="submenu">
    <li><a href="profile.html">Thông tin tài khoản</a></li>
    <li><a href="change-password.html">Thay đổi mật khẩu</a></li>
    <li><a href="addpost.html">Thêm bài viết</a></li>
    <li><a href="#" onclick="logout()">Đăng xuất</a></li>
    </ul>
    </li> 
    `;
    } else {
        str = `
    <li><a href="#">Tài Khoản</a>
    <ul class="submenu">
    <li><a href="login.html">Đăng nhập</a></li>
    <li><a href="register.html">Đăng ký</a></li>
    </ul>
    </li> 
    `;
    }
    elmNavigation.innerHTML += str;
}
// end call api & render navigation

const PROMISE_NAV = getNavigation();

PROMISE_NAV.then(() => {
    getCurrentUserInfo()
        .then((response) => {
            renderCurrentUserInfo(true, response.data.data);
            return response.data.data;
        })
        .catch((error) => {
            renderCurrentUserInfo(false);
        });
    loadFavorite();
});
