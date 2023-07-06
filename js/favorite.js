let recentArticles = document.querySelector("#recentArticles");
let elmCategoriName = document.querySelector("#categoriName h3");
let dataPost = [];
if (favoritePostList.length !== 0) {
  elmCategoriName.innerHTML = "Bài viết yêu thích";
}

// call api & getFavoritePost
function getFavoritePost() {
  return new Promise((resolve, reject) => {
    const promises = [];

    for (const id in favoritePostList) {
      const promise = API_NEWS.get(`/articles/${favoritePostList[id]}`)
        .then((response) => {
          dataPost.push(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        // Tất cả các yêu cầu đã hoàn thành
        resolve(dataPost);
      })
      .catch((error) => {
        reject(error);
      });
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

recentArticles.addEventListener("click", function (e) {
  if (e.target.tagName === "I") {
    clickHeartBtn(e.target); // update local stoage
    let divElement = e.target.closest(".single-recent.mb-100");
    divElement.remove();
    if (favoritePostList.length == 0) {
      elmCategoriName.innerHTML = "Chưa có bài viết nào yêu thích";
    }
  }
});

getFavoritePost()
  .then(() => {
    renderRecentArticles(dataPost);
    loadFavorite();
  })
  .catch((error) => {
    console.log(error);
  });
