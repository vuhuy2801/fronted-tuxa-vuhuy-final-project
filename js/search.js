let elmPreviousPages = document.querySelector("#previousPages");
let elmNextPages = document.querySelector("#nextPages");
let elmresultArticles = document.querySelector("#resultArticles");
let elmPaginationList = document.querySelector("#paginationList");
let elmSearchResult = document.querySelector("#searchResult h3");
let lastPage;

const REGEX = /^[1-9]\d*$/;

const CURRENT_URL = new URL(window.location);
const VALUE_SEARCH_PARAMS = new URLSearchParams(window.location.search);
const KEYWORD = VALUE_SEARCH_PARAMS.get("keyword");
const PAGES = parseInt(VALUE_SEARCH_PARAMS.get("page"));
const REGEX_KEYWORD = new RegExp(KEYWORD, "gi");
const SEARCH_ARTICLES = `articles/search?q=${KEYWORD}`;

let currentPage = PAGES;

//event next & previous pages
elmNextPages.addEventListener("click", function () {
  if (currentPage == lastPage) {
    return;
  }
  currentPage++;
  search(currentPage);
  CURRENT_URL.searchParams.set("page", currentPage);
  window.history.pushState({}, "", CURRENT_URL);
});
elmPreviousPages.addEventListener("click", function () {
  if (currentPage == 1) {
    return;
  }
  currentPage--;
  search(currentPage);
  CURRENT_URL.searchParams.set("page", currentPage);
  window.history.pushState({}, "", CURRENT_URL);
});

elmPaginationList.addEventListener("click", function (e) {
  if (e.target.tagName === "SPAN") {
    if(currentPage === parseInt(e.target.getAttribute("data-page"))){
      return;
    }
    currentPage = parseInt(e.target.getAttribute("data-page"));
    search(currentPage);
    CURRENT_URL.searchParams.set("page", currentPage);
    window.history.pushState({}, "", CURRENT_URL);
  }
});

// end event

//start event headbutton
elmresultArticles.addEventListener("click", function (e) {
  if (e.target.tagName === "I") {
    clickHeartBtn(e.target);
  }
});
//end event headbutton

// call api & search for Recent Articles
function search(page) {
  return API_NEWS.get(SEARCH_ARTICLES, {
    params: {
      limit: 9,
      page: page,
    },
  })
    .then((response) => {
      elmSearchResult.innerHTML = `tìm thấy <i>${response.data.meta.total}</i> bài viết với từ khóa <i>"${KEYWORD}"</i>`;
      renderelmresultArticles(response.data.data);
      lastPage = response.data.meta.last_page;
      renderPaginationButton(page);
      statusButton();
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderelmresultArticles(data) {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += ` 
        <div class="single-recent mb-100 ">
            <div class="what-img">
                <img src="${data[i].thumb}" alt="">
            </div>
            <div class="what-cap">
            <i class="iconHeart fa-solid fa-heart" id="${data[i].id}"></i>
             <a href="categori.html?id=${
               data[i].category.id
             }&page=1"><span class="color1">${data[i].category.name}</span></a>
                <h4><a href="single-blog.html?id=${data[i].id}">${highLight(
      data[i].title
    )}</a></h4>
                <div class="description">
                <p>${highLight(data[i].description)}</p>
                </div>
            </div>
        </div>`; // render articles
  }
  elmresultArticles.innerHTML = str;
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
    }
  } else if (lastPage <= 5) {
    for (let i = 1; i <= lastPage; i++) {
      if (i === indexPage) {
        str += samplePageItem(i, "active");
      } else {
        str += samplePageItem(i, "");
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

function highLight(text) {
  return text.replaceAll(REGEX_KEYWORD, '<mark class="highlight">$&</mark>');
}
// end call api & Pagination for Recent Articles

search(PAGES).then((results) => {
  loadingEffect(true);
  loadFavorite();
});
