let elmNavigation = document.querySelector("#navigation");
let elmDetailsContent = document.querySelector("#detailsContent");
const cateGetAllApi = "/categories_news?limit=100";
const API_NEWS = axios.create({
  baseURL: "https://apiforlearning.zendvn.com/api/v2",
  headers: { "X-Custom-Header": "foobar" },
});

const REGEX = /^[1-9]\d*$/;
const VALUE_SEARCH_PARAMS = new URLSearchParams(window.location.search);
const ARTICLES_ID = parseInt(VALUE_SEARCH_PARAMS.get("id"));
const GET_DETAILS = `/articles/${ARTICLES_ID}`;

// // Kiểm tra giá trị của tham số id có hợp lệ hay không
if (!isValidId()) {
  // Nếu giá trị không hợp lệ, điều hướng URL về trang index.html
  window.location.href = "/index.html";
}

function isValidId() {
  return REGEX.test(ARTICLES_ID);
}

// start call api & render navigation
function getNavigation() {
  API_NEWS.get(cateGetAllApi)
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
    </li>`;
  elmNavigation.innerHTML = strMenu + strSubMenu;
}
// end call api & render navigation

// start render details content

function getDetailsContent() {
  API_NEWS.get(GET_DETAILS)
    .then((response) => {
      renderDetailsContent(response.data.data);
    })
    .catch((error) => {
      console.log(error);
      detailsError();
    });
}
function renderDetailsContent(data) {
  let sampleHeadImage = (links) => {
    return `
            <div class="about-img">
                <img src="${links}" alt="">
            </div>`;
  };
  let sampleTittle = (tittle) => {
    return `
        <div class="section-tittle mb-30 pt-30">
            <h3>${tittle}</h3>
        </div>`;
  };
  let sampleMainDetails = (content) => {
    return `
        <div class="about-prea">
            ${content}
        </div>`;
  };
  let str =
    sampleHeadImage(data.thumb) +
    sampleTittle(data.title) +
    sampleMainDetails(data.content);
  elmDetailsContent.innerHTML = str;
}

function detailsError() {
  elmDetailsContent.innerHTML = "<h4>không có bài viết này</h4>";
}
// end render details content

getDetailsContent();
