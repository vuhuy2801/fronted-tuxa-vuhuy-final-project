let elmPreviousPages = document.querySelector("#previousPages");
let elmNextPages = document.querySelector("#nextPages");
let recentArticles = document.querySelector("#recentArticles");
let elmPaginationList = document.querySelector("#paginationList");
let elmCategoriName = document.querySelector("#categoriName h3");
let lastPage;

const REGEX = /^[1-9]\d*$/;

const CURRENT_URL = new URL(window.location);
const VALUE_SEARCH_PARAMS = new URLSearchParams(window.location.search);
const CATE_ID = parseInt(VALUE_SEARCH_PARAMS.get("id"));
const PAGES = parseInt(VALUE_SEARCH_PARAMS.get("page"));
const GET_ARTICLES_BY_CATE = `categories_news/${CATE_ID}/articles`;

let currentPage = PAGES;

// Kiểm tra giá trị của tham số id có hợp lệ hay không
if (!isValidId() || !isVaildPage()) {
  // Nếu giá trị không hợp lệ, điều hướng URL về trang index.html
  window.location.href = "/index.html";
}
function isValidId() {
  return REGEX.test(CATE_ID);
}

function isVaildPage() {
  return REGEX.test(PAGES);
}

//event next & previous pages
elmNextPages.addEventListener("click", function () {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  getPaginationOfRecentArticles(currentPage);
  CURRENT_URL.searchParams.set("page", currentPage);
  window.history.pushState({}, "", CURRENT_URL);
});
elmPreviousPages.addEventListener("click", function () {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getPaginationOfRecentArticles(currentPage);
  CURRENT_URL.searchParams.set("page", currentPage);
  window.history.pushState({}, "", CURRENT_URL);
});

elmPaginationList.addEventListener("click", function (e) {
  if (e.target.tagName === "SPAN") {
    if(currentPage === parseInt(e.target.getAttribute("data-page"))){
      return;
    }
    currentPage = parseInt(e.target.getAttribute("data-page"));
    getPaginationOfRecentArticles(currentPage);
    CURRENT_URL.searchParams.set("page", currentPage);
    window.history.pushState({}, "", CURRENT_URL);
  }
});

// end event next & previous pages

//start event headbutton
recentArticles.addEventListener("click", function (e) {
  if (e.target.tagName === "I") {
    clickHeartBtn(e.target);
  }
});
//end event headbutton

// call api & Pagination for Recent Articles
function getPaginationOfRecentArticles(page) {
  return API_NEWS.get(GET_ARTICLES_BY_CATE, {
    params: {
      limit: 6,
      page: page,
    },
  })
    .then((response) => {
      elmCategoriName.innerText,
        (elmHeadTitle.innerHTML = response.data.data[0].category.name);
      renderRecentArticles(response.data.data);
      lastPage = response.data.meta.last_page;
      renderPaginationButton(page);
      statusButton();
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderRecentArticles(data) {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += ` 
        <div class="single-recent mb-100 ">
            <div class="what-img">
                <img src="${data[i].thumb}" alt="">
            </div>
            <div class="what-cap">
            <i class="iconHeart fa-solid fa-heart" id="${data[i].id}"></i>
                <h4><a class="title" href="single-blog.html?id=${data[i].id}">${data[i].title}</a></h4>
                <div class="description">
                <p>${data[i].description}</p>
                </div>
            </div>
        </div>`; // render articles
  }
  recentArticles.innerHTML = str;
}

function renderPaginationButton(indexPage) {
  let morePage = `
    <li class="page-item">
      <a class="page-link">..</a>
    </li>
    `;
  let samplePageItem = (index, active) => {
    return `
                <li class="page-item ${active}">
                    <span class="page-link"  data-page="${index}">${index}</span>
                </li>`;
  };
  let startindex,
    endindex = 0;
  let str = ``;
  if (indexPage >= 6) {
    str += samplePageItem(1, "");
    str += morePage;
  }
  if (indexPage + 2 < lastPage && indexPage - 2 > 1) {
    startindex = indexPage - 2;
    endindex = indexPage + 2;
    for (let i = startindex; i <= endindex; i++) {
      if (i === indexPage) {
        str += samplePageItem(i, "active");
      } else {
        str += samplePageItem(i, "");
      }
    }
    if (indexPage <= lastPage - 6) {
      str += morePage;
      str += samplePageItem(lastPage);
    } else if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        if (i === indexPage) {
          str += samplePageItem(i, "active");
        } else {
          str += samplePageItem(i, "");
        }
      }
    }
  } else if (!(indexPage + 2 < lastPage)) {
    for (let i = lastPage - 5; i <= lastPage; i++) {
      if (i === indexPage) {
        str += samplePageItem(i, "active");
      } else {
        str += samplePageItem(i, "");
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      if (i === indexPage) {
        str += samplePageItem(i, "active");
      } else {
        str += samplePageItem(i, "");
      }
    }
    str += morePage;
    str += samplePageItem(lastPage, "");
  }

  elmPaginationList.innerHTML = str;
}
function statusButton() {
  if (currentPage > 1) {
    elmPreviousPages.classList.add("right-arrow");
  }
  if (currentPage == lastPage) {
    elmNextPages.classList.remove("right-arrow");
  }
  if (currentPage < lastPage) {
    elmNextPages.classList.add("right-arrow");
  }
  if (currentPage == 1) {
    elmPreviousPages.classList.remove("right-arrow");
  }
}
// end call api & Pagination for Recent Articles

getPaginationOfRecentArticles(PAGES).then((results) => {
  loadingEffect(true);
  loadFavorite();
});
