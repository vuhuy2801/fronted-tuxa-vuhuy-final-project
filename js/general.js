const CATE_GET_ALL_API = "/categories_news?limit=100";
const ARTICLES_GET_ALL = "/articles?limit=10";
const ARTICLES_GET_MOST_VIEW = "/articles/popular?limit=5";
const GET_ALL_WITH_ARTICELS = "/categories_news/articles?limit_cate=5&limit=4";
const PAGINATION_OF_ARTICLES = "/articles?limit=6&page=";
let loadingListElm = document.querySelectorAll(".row.loadingEffect");

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
