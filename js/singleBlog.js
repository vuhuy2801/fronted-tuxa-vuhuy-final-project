let elmPostContent = document.querySelector("#postContent");
let elmPostRelated = document.querySelector("#postRelated");

const REGEX = /^[1-9]\d*$/;
const VALUE_SEARCH_PARAMS = new URLSearchParams(window.location.search);
const ARTICLES_ID = parseInt(VALUE_SEARCH_PARAMS.get("id"));
const GET_DETAILS = `/articles/${ARTICLES_ID}`;
const GET_RELATED = `/articles/${ARTICLES_ID}/related?limit=4`;

// Kiểm tra giá trị của tham số id có hợp lệ hay không
if (!isValidId()) {
  // Nếu giá trị không hợp lệ, điều hướng URL về trang index.html
  window.location.href = "/index.html";
}

function isValidId() {
  return REGEX.test(ARTICLES_ID);
}

// start render post content

function getPostContent() {
  API_NEWS.get(GET_DETAILS)
    .then((response) => {
      renderPostContent(response.data.data);
    })
    .catch((error) => {
      console.log(error);
      postError();
    });
}
function renderPostContent(data) {
  let sampleHeadImage = (links) => {
    return `
             <div class="feature-img">
                <img class="img-fluid" src="${links}" alt="">
            </div>`;
  };
  // let sampleTittle = (tittle) =>{
  //     return `
  //     <div class="section-tittle mb-30 pt-30">
  //         <h3>${tittle}</h3>
  //     </div>`;
  // }
  let sampleMainDetails = (title, author, content) => {
    return `
        <div class="blog_details">
                 <h2>${title}
                 </h2>
                 <ul class="blog-info-link mt-3 mb-4">
                    <li><a href="#"><i class="fa fa-user"></i>${author}</a></li>
                    <li><a href="#"><i class="fa fa-comments"></i> 03 Comments</a></li>
                 </ul>
                <div id"details">
                    ${content}
                </div>   
        </div>`;
  };
  let str =
    sampleHeadImage(data.thumb) +
    sampleMainDetails(data.title, data.author, data.content);
  elmPostContent.innerHTML = str;
}

function postError() {
  elmPostContent.innerHTML = "<h4>không có bài viết này</h4>";
}
// end render details content

// start render postRelated
function getPostRelated() {
  return API_NEWS.get(GET_RELATED)
    .then((response) => {
      renderPostRelated(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderPostRelated(data) {
  let samplePostItem = (links, title, id, date) => {
    return `
        <div class="media post_item">
                           <img src="${links}" alt="post">
                           <div class="media-body">
                              <a title="${title}" href="single-blog.html?id=${id}">
                                 <h3>${title}</h3>
                              </a>
                              <p>${timeAgo(date)}</p>
                           </div>
                        </div>
        `;
  };
  let str = "";
  for (let i = 0; i < data.length; i++) {
    str += samplePostItem(
      data[i].thumb,
      data[i].title,
      data[i].id,
      new Date(data[i].publish_date)
    );
  }
  elmPostRelated.innerHTML = str;
}

// end render postRelated


getPostRelated().then(() => {
  loadingEffect(true);
  updateFavoriteNav();
});
getPostContent();


