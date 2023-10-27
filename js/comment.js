let elmCommentInput = document.querySelector("#commentInput");
let elmCommentList = document.querySelector("#commentList");
let elmBtnSendComment = document.querySelector("#btnSendComment");
let indexOfPostComments = -1; // -1 is null Comment in post

elmBtnSendComment.addEventListener("click", (e) => {
    e.preventDefault();
    handleNewComment();
});

function renderComment() {
    const replyCommentHTML = (id) => {
        return `
    <div class="sub-comment reply justify-content-between d-none" id="${id}">
        <div class="user justify-content-between d-flex">
            <div class="thumb">
                <img
                    src="assets/img/comment/comment_2.png"
                    alt=""
                    style="width: 40px"
                />
            </div>
            <div class="desc">
                <div class="replyFor">trả lời guguyb1@gmail.com </div>
                <div class="input-group comment">
                        <input
                            id="input${id}"
                            type="text"
                            class="form-control"
                            placeholder="nhập bình luận..."
                        />
                    <div class="input-group-append">
                        <button
                            class="btn-custom btn-primary"
                            type="button"
                            onclick="handleNewSubComment('${id}')"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
    </div>
</div>
    `;
    };
    const commentHTML = commentList
        .filter((data) => data.postId === ARTICLES_ID)
        .map((data) => {
            const comments = data.comments
                .map((comment) => {
                    date = new Date(comment.dateTime);
                    const commentHTML = `
                <div class="comment-list">
                    <div class="single-comment justify-content-between d-flex">
                        <div class="user justify-content-between d-flex">
                            <div class="thumb">
                                <img src="assets/img/comment/comment_1.png" alt=""/>
                            </div>
                            <div class="desc">
                                <p class="comment">${comment.content}</p>
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <h5><a href="#">${
                                            comment.email
                                        }</a></h5>
                                        <p class="date">${timeAgo(date)}</p>
                                    </div>
                                    <div class="reply-btn btn-reply text-uppercase"  onclick="displayReply('${
                                        comment.email
                                    }', '${comment.id}')">
                                    reply
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                    const subComments =
                        `<div class="sub-comment-list">` +
                        comment.subComments
                            .map((subComment) => {
                                date = new Date(subComment.dateTime);
                                return `
                        <div class="sub-comment justify-content-between d-flex">
                            <div class="user justify-content-between d-flex">
                                <div class="thumb">
                                    <img src="assets/img/comment/comment_2.png" alt=""/>
                                </div>
                                <div class="desc">
                                    <p class="comment">${subComment.content}</p>
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <h5><a href="#">${
                                                subComment.email
                                            }</a></h5>
                                            <p class="date">${timeAgo(date)}</p>
                                        </div>
                                        <div class="reply-btn btn-reply text-uppercase"  onclick="displayReply('${
                                            subComment.email
                                        }', '${comment.id}')">
                                            reply
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                `;
                            })
                            .join("") +
                        replyCommentHTML(comment.id) +
                        `</div>`;

                    return commentHTML + subComments;
                })
                .join("");

            return comments;
        })
        .join("");

    elmCommentList.innerHTML = commentHTML
        ? commentHTML
        : `<h4>Không có bình luận nào</h4>`;
}

function displayReply(email, elementSubComments) {
    let elmReply = document.getElementById(elementSubComments);
    elmReply.classList.remove("d-none");
    elmReply.classList.add("d-flex");
    elmReply.querySelector(".desc .replyFor").textContent = `Trả lời:${email}`;
    elmReply.scrollIntoView({ behavior: "smooth", block: "center" });
}

function checkComentList() {
    if (commentList) {
        commentList.map((data, index) => {
            if (data.postId === ARTICLES_ID) {
                indexOfPostComments = index;
            }
        });
    } else {
        commentList = [];
        localStorage.setItem("commentList", JSON.stringify(commentList));
    }
}

function handleNewSubComment(id) {
    if (!ACCESS_TOKEN) {
        return alert("vui lòng đăng nhập để bình luận");
    }
    let elmInputContent = document.getElementById("input" + id);
    if (!elmInputContent.value) {
        return alert("nội dung không được để trống");
    }
    const comments = commentList[indexOfPostComments].comments;
    comments.map((data, index) => {
        if (data.id === id) {
            const newSubComment = {
                id: generateID(24),
                content: elmInputContent.value,
                dateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                email: currentUserInfo.email,
            };
            commentList[indexOfPostComments].comments[index].subComments.push(
                newSubComment
            );
        }
    });
    renderComment();
    localStorage.setItem("commentList", JSON.stringify(commentList));
}

function handleNewComment() {
    if (!ACCESS_TOKEN) {
        return alert("vui lòng đăng nhập để bình luận");
    }
    if (!elmCommentInput.value) {
        return alert("nội dung không được để trống");
    }
    let content = elmCommentInput.value;
    checkComentList();
    if (indexOfPostComments >= 0) {
        let newComment = {
            id: generateID(24),
            content: content,
            dateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            email: currentUserInfo.email,
            subComments: [],
        };
        commentList[indexOfPostComments].comments.push(newComment);
    } else {
        let newCommentPost = {
            postId: ARTICLES_ID,
            comments: [
                {
                    id: generateID(24),
                    content: content,
                    dateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    email: currentUserInfo.email,
                    subComments: [],
                },
            ],
        };
        commentList.push(newCommentPost);
    }

    renderComment();
    elmCommentInput.value = "";
    localStorage.setItem("commentList", JSON.stringify(commentList));
}

function generateID(length) {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

checkComentList();
renderComment();
