let blogCacheObject = {
    UUID      : "N/A",
    author    : "N/A",
    form      : "N/A",
    likes     : 0,
    message   : "N/A",
    parent    : "N/A",
    postDate  : "N/A",
    resources : "N/A",
    ID        : 0
};

let blogEnableState: boolean            = false;
let blogCache: typeof blogCacheObject[] = [];
let activeElms: string[] = [];


let getBlogs = (start:number, end:number) => {
    let lastElm = blogCache[blogCache.length];
    if (start > end) { // just in case we somehow have start > end just swap them
        let tmp = start;
        start = end
        end = tmp;
    }
    if (lastElm != undefined) {
        if (lastElm.ID > end)
            return; // we should have this cached already
        else if (lastElm.ID > start)
            start = lastElm.ID;
    }
    HTTPRequest(`/api/getPost/${start}&${end}`,
                HTTPMethods.GET, "",
                (response: string) => {
                    /**
                     * [
                     *  {
                     *      UUID      : string
                     *      author    : string
                     *      form      : string
                     *      likes     : number
                     *      message   : string
                     *      parent    : string
                     *      postDate  : string
                     *      resources : string
                     *  }
                     * ]
                     */
                    let obj = JSON.parse(response);
                    let display = document.getElementById("blogDisplay")!;
                    display.innerHTML = '';
                    for(let i = 0; i < obj.length; i++) {
                        if (blogCache.includes(obj[i]))
                            continue;
                        blogCache.push(obj[i]);
                        let elm = document.createElement("div");
                        elm.id = obj[i].UUID;
                        elm.classList.add("blogPost");
                        elm.innerHTML = `
                            <div class="blogPostHeader">
                                <span class="blogAuthorName">Author: ${obj[i].author}</span>
                                <span class="float-right blogPostDate">${obj[i].postDate}</span>
                            </div>
                            <div class="blogPostBody">
                                ${obj[i].message}
                            </div>
                        `
                        elm.onclick = () => {
                            let cur = elm;
                            if (activeElms.includes(obj[i].UUID)) {
                                cur.style.height = "150px";
                                cur.style.webkitMaskImage = "linear-gradient(180deg, #000 60%, transparent)";
                                cur.style.overflow = "hidden";
                                activeElms.splice(activeElms.indexOf(obj[i].UUID))
                            } else {
                                cur.style.height = "600px";
                                cur.style.overflow = "scroll";
                                cur.style.webkitMaskImage = "";
                                activeElms.push(obj[i].UUID);
                                
                            }
                        };
                        display.appendChild(elm);
                    }
                }, generalErrorCallback);
};

let blogCreationSuccess = (response: any) => {
    alert(response);
};

let blogCreationError = (response: any) => {
    let blog = (document.getElementById("blogData")! as HTMLTextAreaElement);
    blog.value = "";

    alert("Blog post created successfully!");
};

let createBlogPost = () => {
    if (!loggedIn && getCookie("username") === undefined) {
        alert("Error User must be logged in for this action!");
        return;
    }

    let blogData = (document.getElementById("blogData")! as HTMLTextAreaElement).value;

    if (blogData === "") {
        alert("You must type something.");
    }

    HTTPRequest("/api/post/blog", 
                "POST", 
                blogData,
                blogCreationSuccess, 
                blogCreationError);
};