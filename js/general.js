let loadingListElm = document.querySelectorAll(".row.loadingEffect");
let favoritePostList = JSON.parse(localStorage.getItem("favoritePosts"));
let elmFavoriteNav;




const CATE_GET_ALL_API = "/categories_news?limit=100";
const ARTICLES_GET_ALL = "/articles?limit=10";
const ARTICLES_GET_MOST_VIEW = "/articles/popular?limit=5";
const GET_ALL_WITH_ARTICELS = "/categories_news/articles?limit_cate=5&limit=4";
const PAGINATION_OF_ARTICLES = "/articles?limit=6&page=";


const API_NEWS = axios.create({
  baseURL: "https://apiforlearning.zendvn.com/api/v2",
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


function clickHeartBtn(element){
  const ID_ELEMENT = parseInt(element.getAttribute("id"));
  element.classList.toggle("active");
  if (element.classList.contains("active")) {
    favoritePostList.push(ID_ELEMENT);
    localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
    updateFavoriteNav();
  } else {
    const index = favoritePostList.indexOf(ID_ELEMENT);
    if (index !== -1) {
      favoritePostList.splice(index, 1);
    }
    localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
    updateFavoriteNav();
  }
}

function loadFavorite() {
  let elmHeartList = document.querySelectorAll(".iconHeart");
  elmHeartList.forEach((element) => {
    if (favoritePostList.indexOf(parseInt(element.getAttribute("id"))) !== -1) {
      element.classList.add("active");
    }
    updateFavoriteNav();
  });
}

function updateFavoriteNav() {
  elmFavoriteNav = document.querySelector(".favoriteNav");
  elmFavoriteNav.innerHTML = `Bài Viết Yêu Thích (${favoritePostList.length})`;
}
//  end favorite 

function timeAgo(date) {
  dayjs.extend(dayjs_plugin_relativeTime);
  dayjs.locale("vi");
  const customDate = dayjs(date);
  return customDate.fromNow();
}