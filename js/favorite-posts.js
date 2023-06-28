let favoritePostList = JSON.parse(localStorage.getItem("favoritePosts"));
let elmFavoriteNav;

if (favoritePostList == null) {
  favoritePostList = [];
}

function pavoritePosts() {
  let elmHeartList = document.querySelectorAll(".iconHeart");
  elmFavoriteNav = document.querySelector(".favoriteNav");
  elmHeartList.forEach((element) => {
    // add event button heart
    element.addEventListener("click", function () {
      this.classList.toggle("active");
      if (this.classList.contains("active")) {
        favoritePostList.push(this.getAttribute("id"));
        localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
        updateFavoriteNav();
      } else {
        const index = favoritePostList.indexOf(this.getAttribute("id"));
        if (index !== -1) {
          favoritePostList.splice(index, 1);
        }
        localStorage.setItem("favoritePosts", JSON.stringify(favoritePostList));
        updateFavoriteNav();
      }
    });
    //load favorite post
    if (favoritePostList.indexOf(element.getAttribute("id")) !== -1) {
      element.classList.add("active");
    }
    updateFavoriteNav();
  });
}

function updateFavoriteNav() {
  elmFavoriteNav.innerHTML = `Bài Viết Yêu Thích (${favoritePostList.length})`;
}
