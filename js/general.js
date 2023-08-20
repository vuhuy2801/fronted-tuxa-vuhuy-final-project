let loadingListElm = document.querySelectorAll(".row.loadingEffect");
let favoritePostList = JSON.parse(localStorage.getItem("favoritePosts"));

let elmFavoriteNav;
let elmHaderInfoLeft = document.querySelector(".header-info-left");
let elmHeadTitle = document.querySelector("head title");

const ACCESS_TOKEN = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
const CATE_GET_ALL_API = "/categories_news?limit=100";
const ARTICLES_GET_ALL = "/articles?limit=10";
const ARTICLES_GET_MOST_VIEW = "/articles/popular?limit=5";
const GET_ALL_WITH_ARTICLES = "/categories_news/articles?limit_cate=5&limit=4";
const PAGINATION_OF_ARTICLES = "/articles?limit=6&page=";
const CURRENT_USER_INFO = "/auth/me";
const LOGIN = "/auth/login";
const REGISTER = "/users/register";
const UPDATE_CURRENT_USER_INFO = "/auth/update";
const CHANGE_PASSWORD = "/auth/change-password";

const API_NEWS = axios.create({
  baseURL: "http://apiforlearning.zendvn.com/api/v2",
  headers: { "X-Custom-Header": "foobar" },
});

// for all  page
function loadingEffect(status) {
  // true = unDisplay || false = display
  if (status) {
    loadingListElm.forEach((element) => {
      element.classList.add("d-none");
    });
  } else {
    loadingListElm.forEach((element) => {
      element.classList.remove("d-none");
    });
  }
}

//  start favorite
if (favoritePostList == null) {
  favoritePostList = [];
}

function clickHeartBtn(element) {
  const ID_ELEMENT = parseInt(element.getAttribute("id"));
  element.classList.toggle("active");
  if (element.classList.contains("active")) {
    favoritePostList.push(ID_ELEMENT);
    localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
    updateFavorite(element, "Đã yêu thích bài viết: ");
  } else {
    const index = favoritePostList.indexOf(ID_ELEMENT);
    if (index !== -1) {
      favoritePostList.splice(index, 1);
    }
    localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
    updateFavorite(element, "Đã bỏ thích bài viết: ");
  }
}

function loadFavorite() {
  let elmHeartList = document.querySelectorAll(".iconHeart");
  elmHeartList.forEach((element) => {
    if (favoritePostList.indexOf(parseInt(element.getAttribute("id"))) !== -1) {
      element.classList.add("active");
    } else{
      element.classList.remove("active");
    }
  });
  updateFavorite();
}

function updateFavorite(element, textStatus) {
  elmFavoriteNav = document.querySelector(".favoriteNav");
  elmFavoriteNav.innerHTML = `Bài Viết Yêu Thích (${favoritePostList.length})`;

  if (element == undefined) {
    return; // stop funtion when no need notication
  }
  let elmTitleArticles;
  // notication state a pavorite articles
  if (element.closest(".what-cap") !== null) {
    elmTitleArticles = element.closest(".what-cap").querySelector("a.title");
  } else if (element.closest(".weekly-caption") !== null) {
    elmTitleArticles = element
      .closest(".weekly-caption")
      .querySelector("a.title");
  } else if (element.closest(".trand-right-cap") !== null) {
    elmTitleArticles = element
      .closest(".trand-right-cap")
      .querySelector("a.title");
  } else if (element.closest(".trend-bottom-cap") !== null) {
    elmTitleArticles = element
      .closest(".trend-bottom-cap")
      .querySelector("a.title");
  } else if (element.closest(".trend-top-cap") !== null) {
    elmTitleArticles = element.closest(".trend-top-cap").querySelector("h2 a");
  }

  Toastify({
    text: textStatus + elmTitleArticles.innerText,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #ff4e50, #f9d423)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
//  end favorite

function timeAgo(date) {
  dayjs.extend(dayjs_plugin_relativeTime);
  dayjs.locale("vi");
  const customDate = dayjs(date);
  return customDate.fromNow();
}

// weather
function getWeather() {
  return axios
    .get("https://jsonip.com/") // get ip client
    .then(function (response) {
      return response.data.ip;
    })
    .then(function (ip) {
      return axios
        .get(
          `http://api.weatherapi.com/v1/current.json?key=ecedadbfda3c4d2e88b92401231703&q=${ip}&aqi=no` // get weather in client
        )
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

getWeather()
  .then(function (data) {
    getDayTextByCodeAndLang(data.current.condition.code, "vi").then(function (
      textConditon
    ) {
      renderWidgetWeatherNav(data, textConditon);
    }); // In ra dữ liệu thời tiết
  })
  .catch(function (error) {
    console.log(error); // In ra lỗi nếu có
  });

function getDayTextByCodeAndLang(code, lang_iso) {
  return axios
    .get("./assets/json/conditions.json")
    .then(function (response) {
      var jsonData = response.data;

      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].code === code) {
          var languages = jsonData[i].languages;
          for (var j = 0; j < languages.length; j++) {
            if (languages[j].lang_iso === lang_iso) {
              return languages[j].day_text;
            }
          }
        }
      }

      return "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function renderWidgetWeatherNav(data, textConditon) {
  dayjs.locale("vi");
  const CUSTOM_DATE = dayjs(data.current.last_updated);
  const FORMATTED_DATE = CUSTOM_DATE.format("dddd, DD/MM/YYYY");
  const WEATHER_STR = `${data.current.temp_c}ºc, ${textConditon}, ${data.location.name}`;
  elmHaderInfoLeft.innerHTML = `
                    <ul>
                      <li>
                        <img
                          src="${data.current.condition.icon}"
                          alt=""
                        />${WEATHER_STR}
                      </li>
                      <li>
                        <img
                          src="assets/img/icon/header_icon2.png"
                          alt=""
                        />${FORMATTED_DATE}
                      </li>
                    </ul>
  `;
}

function logout(){
  localStorage.removeItem("ACCESS_TOKEN");
  window.location.href = "/index.html";
}


