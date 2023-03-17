let elmNavigation = document.querySelector("#navigation");
let elmTrendingTop = document.querySelector(".trending-top");
let elmtrendingBottom = document.querySelector(".trending-bottom .row");
let elmtrendingRightContent = document.querySelector(".rightContent");
let elmMostViews = document.querySelector(".weekly-news-active");
let elmNavTabsWhatNews = document.querySelector("#nav-tab");
let elmNavTabContents = document.querySelector("#nav-tabContent");
let elmRecentWrapper = document.querySelector(".recent-wrapper");
let elmPreviousPages = document.querySelector("#previousPages");
let elmNextPages = document.querySelector("#nextPages");
let recentArticles = document.querySelector("#recentArticles");
let elmCurrentPage = document.querySelector("#currentPage");
let lastPage = 0;

const baseUrl = "https://apiforlearning.zendvn.com/api/v2";
const cateGetAllApi = "/categories_news?limit=100";
const articlesGetAll = "/articles?limit=9";
const articlesGetMostViews = "/articles/popular?limit=5";
const GetAllWithArticels = "/categories_news/articles?limit_cate=5&limit=4";
const paginationOfArticles = "/articles?limit=6&page=";

//event next & previous pages
elmNextPages.addEventListener('click', function () {
    if (elmCurrentPage.text == lastPage) {
        return;
    }
    if (elmCurrentPage.text !== 1) {
        elmPreviousPages.classList.add("right-arrow");
    }
    getPaginationOfRecentArticles(++elmCurrentPage.text);
    if (elmCurrentPage.text == lastPage) {
        elmNextPages.classList.remove("right-arrow");
    }
});
elmPreviousPages.addEventListener('click', function () {
    if (elmCurrentPage.text == 1) {
        return;
    }
    if (elmCurrentPage.text !== lastPage) {
        elmNextPages.classList.add("right-arrow");
    }
    getPaginationOfRecentArticles(--elmCurrentPage.text);
    if (elmCurrentPage.text == 1) {
        elmPreviousPages.classList.remove("right-arrow");
    }
});



// call api & render navigation
function getNavigation() {
    axios.get(baseUrl + cateGetAllApi)
        .then((response) => {
            renderNavigation(response.data.data);
            /* 2. slick Nav */
            // mobile_menu
            var menu = $('ul#navigation');
            if (menu.length) {
                menu.slicknav({
                    prependTo: ".mobile_menu",
                    closedSymbol: '+',
                    openedSymbol: '-'
                });
            };
        })
        .catch((error) => {
            console.log(error);
        });
}

// call api & render trendingNews
function getTrendingNews() {
    axios.get(baseUrl + articlesGetAll)
        .then((response) => {
            renderTrendingTop(response.data.data);
            renderTrendingBottom(response.data.data);
            renderTrendingRightContent(response.data.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

// call api & render MostViews
function getMostViews() {
    axios.get(baseUrl + articlesGetMostViews)
        .then((response) => {
            renderArticleMostViews(response.data.data);
            //add animation 
            $('.weekly-news-active').slick({
                dots: true,
                infinite: true,
                speed: 500,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: false,
                initialSlide: 3,
                loop: true,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: false,
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            });
            return response;
        })
        .catch((error) => {
            console.log(error);
        });
}

// call api & render What news 
function getWhatNews() {
    axios.get(baseUrl + GetAllWithArticels)
        .then((response) => {
            renderWhatNewsNav(response.data.data);
            renderWhatNewsCard(response.data.data);
        })
        .catch((error) => {
            console.log(error);
        });
}


// call api & Pagination for Recent Articles
function getPaginationOfRecentArticles(page) {
    axios.get(baseUrl + paginationOfArticles + page)
        .then((response) => {
            renderRecentArticles(response.data.data);
            elmCurrentPage.innerText = response.data.meta.current_page;
            lastPage = response.data.meta.last_page;
        })
        .catch((error) => {
            console.log(error);
        });
}

function renderRecentArticles(articles) {
    let str = "";
    for (let i = 0; i < articles.length; i++) {
        str += ` 
        <div class="single-recent mb-100 ">
            <div class="what-img">
                <img src="${articles[i].thumb}" alt="">
            </div>
            <div class="what-cap">
                <span class="color1">${articles[i].category.name}</span>
                <h4><a href="#">${articles[i].title}</a></h4>
            </div>
        </div>`; // render articles
    }
    recentArticles.innerHTML = str;
}

function renderWhatNewsCard(data) {
    let cards = `<div class="tab-pane fade show active" id="${data[0].slug}" role="tabpanel" aria-labelledby="${data[0].slug}-tab">           
                    <div class="whats-news-caption">
                        <div class="row">
                            ${renderWhatNewsArticles(data[0].articles, data[0].name)}
                        </div>
                    </div>
                </div> `; // active card
    for (let i = 1; i < data.length; i++) {
        cards += `
                <div class="tab-pane fade" id="${data[i].slug}" role="tabpanel" aria-labelledby="${data[i].slug}-tab">
                    <div class="whats-news-caption">
                        <div class="row">
                        ${renderWhatNewsArticles(data[i].articles, data[i].name)}
                        </div>
                    </div>
                </div>`;
    }
    elmNavTabContents.innerHTML = cards;
}

function renderWhatNewsArticles(articles, nametag) {
    let str = "";
    for (let i = 0; i < articles.length; i++) {
        str += ` <div class="col-lg-6 col-md-6">
        <div class="single-what-news mb-100">
            <div class="what-img">
                <img src="${articles[i].thumb}" alt="">
            </div>
            <div class="what-cap">
                <span class="color1">${nametag}</span>
                <h4><a href="#">${articles[i].title}</a></h4>
            </div>
        </div>
    </div>`; // render articles
    }
    return str;
}

function renderWhatNewsNav(data) {
    let str = `<a class="nav-item nav-link active" id="${data[0].slug}-tab" data-toggle="tab" href="#${data[0].slug}" role="tab" aria-controls="${data[0].slug}" aria-selected="true">${data[0].name}</a>`;
    for (let i = 1; i < data.length; i++) {
        str += `<a class="nav-item nav-link" id="${data[i].slug}-tab" data-toggle="tab" href="#${data[i].slug}" role="tab" aria-controls="${data[i].slug}" aria-selected="true">${data[i].name}</a>`;
    }
    elmNavTabsWhatNews.innerHTML = str;
}

function renderArticleMostViews(data) {
    let str = "";
    for (let i = 0; i < data.length; i++) {
        str += `<div class="weekly-single active">
                                <div class="weekly-img">
                                    <img src="${data[i].thumb}" alt="">
                                </div>
                                <div class="weekly-caption">
                                    <span class="color1">${data[i].category.name}</span>
                                    <h4><a href="#">${data[i].title}</a></h4>
                                </div>
                            </div>`;
    }
    elmMostViews.innerHTML = str;

}

function renderTrendingTop(data) {
    let articleObj = data[0];
    let str = `<div class="trend-top-img">
    <img src="${articleObj.thumb}" alt="">
    <div class="trend-top-cap">
        <span>${articleObj.category.name}</span>
        <h2><a href="details.html">${articleObj.title}</a></h2>
    </div>
    </div>`;
    elmTrendingTop.innerHTML = str;
}

function renderTrendingBottom(data) {
    console.log(elmtrendingBottom);
    let str = "";
    for (let i = 1; i < 4; i++) {
        str += `<div class="col-lg-4">
        <div class="single-bottom mb-35">
            <div class="trend-bottom-img mb-30">
                <img src="${data[i].thumb}" alt="">
            </div>
            <div class="trend-bottom-cap">
                <span class="color1">${data[i].category.name}</span>
                <h4><a href="details.html">${data[i].title}</a></h4>
            </div>
        </div>
        </div>`;
    }
    elmtrendingBottom.innerHTML = str;

}
function renderTrendingRightContent(data) {
    let str = "";
    for (let i = 5; i < data.length; i++) {
        str += ` <div class="trand-right-single d-flex">
                            <div class="trand-right-img">
                                <img src="${data[i].thumb}" alt="">
                            </div>
                            <div class="trand-right-cap">
                                <span class="color1">${data[i].category.name}</span>
                                <h4><a href="details.html">${data[i].title}</a></h4>
                            </div>
                    </div>`;
    }
    elmtrendingRightContent.innerHTML = str;
}


function renderNavigation(data) {
    let strMenu = `<li><a href="index.html">Trang chủ</a></li>`;
    let strSubMenu = `<li><a href="#">Tin Khác</a><ul class="submenu">`;
    for (let i = 1; i < data.length; i++) {
        if (i < 5) {
            strMenu += `<li><a href="${data[i].slug}.html">${data[i].name}</a></li>`; // main menu
        } else {
            strSubMenu += `<li><a href="${data[i].slug}.html">${data[i].name}</a></li>`; // sub menu
        }
    }
    strSubMenu += `</ul>
    </li>`;
    elmNavigation.innerHTML = strMenu + strSubMenu;
}

getNavigation();
getTrendingNews();
getMostViews();
getWhatNews();
getPaginationOfRecentArticles(1);