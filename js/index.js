let elmTrendingTop = document.querySelector(".trending-top");
let elmTrendingBottom = document.querySelector(".trending-bottom .row");
let elmtrendingRightContent = document.querySelector(".rightContent");
let elmMostViews = document.querySelector(".weekly-news-active");
let elmNavTabsWhatNews = document.querySelector("#nav-tab");
let elmNavTabContents = document.querySelector("#nav-tabContent");
let elmRecentWrapper = document.querySelector(".recent-wrapper");
let elmPreviousPages = document.querySelector("#previousPages");
let elmNextPages = document.querySelector("#nextPages");
let recentArticles = document.querySelector("#recentArticles");
let elmCurrentPage = document.querySelector("#currentPage");
let elmWidgetWeather = document.querySelector(".widget");
let lastPage = 0;

//start event next & previous pages
elmNextPages.addEventListener("click", function () {
  if (elmCurrentPage.text == lastPage) {
    return;
  }
  getPaginationOfRecentArticles(++elmCurrentPage.text)
    .then((data) => {
      pavoritePosts();
    })
    .catch((error) => {
      // Xử lý khi Promise bị từ chối
    });
});
elmPreviousPages.addEventListener("click", function () {
  if (elmCurrentPage.text == 1) {
    return;
  }
  getPaginationOfRecentArticles(--elmCurrentPage.text)
    .then((data) => {
      pavoritePosts();
    })
    .catch((error) => {
      // Xử lý khi Promise bị từ chối
    });
});
// end event next & previous pages

// start call api & render trendingNews
function getTrendingNews() {
  return API_NEWS.get(ARTICLES_GET_ALL)
    .then((response) => {
      const data = response.data.data;
      renderTrendingTop(data);
      renderTrendingBottom(data);
      renderTrendingRightContent(data);
      return data; // Trả về data từ Promise để xử lý khi đã hoàn thành
    })
    .catch((error) => {
      console.log(error);
      throw error; // Ném lại lỗi để xử lý khi Promise bị từ chối
    });
}

function renderTrendingTop(data) {
  let articleObj = data[0];
  let str = `<div class="trend-top-img">
    <img src="${articleObj.thumb}" alt="">
    <div class="trend-top-cap">
    <i class="iconHeart fa-solid fa-heart" id="${articleObj.id}"></i>
        <a href="categori.html?id=${articleObj.category.id}&page=1"><span>${articleObj.category.name}</span></a>
        <h2><a href="single-blog.html?id=${articleObj.id}">${articleObj.title}</a></h2>
    </div>
    </div>`;
  elmTrendingTop.innerHTML = str;
}

function renderTrendingBottom(data) {
  let str = "";
  for (let i = 1; i < 4; i++) {
    str += `<div class="col-lg-4">
        <div class="single-bottom mb-35">
            <div class="trend-bottom-img mb-30">
                <img src="${data[i].thumb}" alt="">
            </div>
            <div class="trend-bottom-cap">
            <i class="iconHeart fa-solid fa-heart" id="${data[i].id}"></i>
            <a href="categori.html?id=${data[i].category.id}&page=1"><span class="color1">${data[i].category.name}</span></a>
                <h4><a href="single-blog.html?id=${data[i].id}">${data[i].title}</a></h4>
            </div>
        </div>
        </div>`;
  }
  elmTrendingBottom.innerHTML = str;
}
function renderTrendingRightContent(data) {
  let str = "";
  for (let i = 5; i < data.length; i++) {
    str += ` <div class="trand-right-single d-flex">
                            <div class="trand-right-img">
                                <img src="${data[i].thumb}" alt="">
                            </div>
                            <div class="trand-right-cap">
                            <i class="iconHeart fa-solid fa-heart" id="${data[i].id}"></i>
                            <a href="categori.html?id=${data[i].category.id}&page=1"><span class="color1">${data[i].category.name}</span></a>
                                <h4><a title="${data[i].title}" href="single-blog.html?id=${data[i].id}">${data[i].title}</a></h4>
                            </div>
                    </div>`;
  }
  elmtrendingRightContent.innerHTML = str;
}

// end call api & render trendingNews

// start call api & render MostViews
function getMostViews() {
  return API_NEWS.get(ARTICLES_GET_MOST_VIEW)
    .then((response) => {
      renderArticleMostViews(response.data.data);
      //add animation
      $(".weekly-news-active").slick({
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
            },
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ],
      });
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderArticleMostViews(data) {
  let str = "";
  let date;
  for (let i = 0; i < data.length; i++) {
    date = new Date(data[i].publish_date);
    str += `<div class="weekly-single active">
                                <div class="weekly-img">
                                    <img src="${data[i].thumb}" alt="">
                                </div>
                                <div class="weekly-caption">
                                <a href="categori.html?id=${
                                  data[i].category.id
                                }&page=1"><span class="color1">${
      data[i].category.name
    }</span></a>
                                    <span class="publishDate">${timeAgo(
                                      date
                                    )}</span>
                                    <i class="iconHeart fa-solid fa-heart" id="${
                                      data[i].id
                                    }"></i>
                                    <h4><a href="single-blog.html?id=${
                                      data[i].id
                                    }">${data[i].title}</a></h4>
                                </div>
                            </div>`;
  }
  elmMostViews.innerHTML = str;
}
function timeAgo(date) {
  dayjs.extend(dayjs_plugin_relativeTime);
  dayjs.locale("vi");
  const customDate = dayjs(date);
  return customDate.fromNow();
}
// end call api & render MostViews

// start call api & render What news
function getWhatNews() {
  return API_NEWS.get(GET_ALL_WITH_ARTICELS)
    .then((response) => {
      const data = response.data.data;
      renderWhatNewsNav(data);
      renderWhatNewsCard(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderWhatNewsCard(data) {
  let cards = `<div class="tab-pane fade show active" id="${
    data[0].slug
  }" role="tabpanel" aria-labelledby="${data[0].slug}-tab">           
                    <div class="whats-news-caption">
                        <div class="row">
                            ${renderWhatNewsArticles(data[0].articles)}
                        </div>
                    </div>
                </div> `; // active card
  for (let i = 1; i < data.length; i++) {
    cards += `
                <div class="tab-pane fade" id="${
                  data[i].slug
                }" role="tabpanel" aria-labelledby="${data[i].slug}-tab">
                    <div class="whats-news-caption">
                        <div class="row">
                        ${renderWhatNewsArticles(data[i].articles)}
                        </div>
                    </div>
                </div>`;
  }
  elmNavTabContents.innerHTML = cards;
}

function renderWhatNewsArticles(articles) {
  let str = "";
  for (let i = 0; i < articles.length; i++) {
    str += ` 
        <div class="col-lg-6 col-md-6">
            <div class="single-what-news mb-100">
                <div class="what-img">
                    <img src="${articles[i].thumb}" alt="">
                </div>
            <div class="what-cap">
            <i class="iconHeart fa-solid fa-heart" id="${articles[i].id}"></i>
                <h4><a href="single-blog.html?id=${articles[i].id}">${articles[i].title}</a></h4>
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

// end call api & render What news

// call api & Pagination for Recent Articles
function getPaginationOfRecentArticles(page) {
  return API_NEWS.get(PAGINATION_OF_ARTICLES + page)
    .then((response) => {
      renderRecentArticles(response.data.data);
      elmCurrentPage.innerText = response.data.meta.current_page;
      lastPage = response.data.meta.last_page;
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
            <a href="categori.html?id=${data[i].category.id}&page=1"><span class="color1">${data[i].category.name}</span></a>
                <h4><a href="single-blog.html?id=${data[i].id}">${data[i].title}</a></h4>
            </div>
        </div>`; // render articles
  }
  recentArticles.innerHTML = str;
}
function statusButton() {
  if (elmCurrentPage.text > 1) {
    elmPreviousPages.classList.add("right-arrow");
  }
  if (elmCurrentPage.text == lastPage) {
    elmNextPages.classList.remove("right-arrow");
  }
  if (elmCurrentPage.text < lastPage) {
    elmNextPages.classList.add("right-arrow");
  }
  if (elmCurrentPage.text == 1) {
    elmPreviousPages.classList.remove("right-arrow");
  }
}
// end api & Pagination for Recent Articles

const promise1 = getTrendingNews();
const promise2 = getMostViews();
const promise3 = getWhatNews();
const promise4 = getPaginationOfRecentArticles(1);
getWeather();

Promise.all([promise1, promise2, promise3, promise4])
  .then((results) => {
    pavoritePosts();
  })
  .catch((error) => {});

function getWeather() {
  axios
    .get("https://jsonip.com/") // get ip client
    .then(function (response) {
      return response.data.ip;
    })
    .then(function (ip) {
      axios
        .get(
          `http://api.weatherapi.com/v1/current.json?key=ecedadbfda3c4d2e88b92401231703&q=${ip}&aqi=no` // get weather in client
        )
        .then(function (response) {
          renderWidgetWeather(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

function renderWidgetWeather(data) {
  dayjs.locale("vi");
  const customDate = dayjs(data.current.last_updated);
  const formattedDate = customDate.format("dddd, DD/MM/YYYY");

  elmWidgetWeather.innerHTML = `
  <div class="left-panel panel">
                  <div class="date">${formattedDate}</div>
                  <div class="city">${data.location.name}</div>
                  <img class="condition-icon"
                  src="${data.current.condition.icon}"
                  alt=""
                  width="60"
                />
                </div>
                <div class="right-panel panel">
                  <div class="temp">
                    
                  ${data.current.temp_c}&deg;
                  </div>
                </div>`;
}
