let blogCacheObject = {
    UUID      : "N/A",
    author    : "N/A",
    form      : "N/A",
    likes     : 0,
    likedby   : "N/A",
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
                        let buttons = document.createElement("div");
                        buttons.classList.add("blogPostButtons");
                        elm.id = 'bl'+obj[i].UUID;
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
                        let uName = getCookie("username");
                        let likedText = "&#x2661;";
                        toString().includes
                        if (uName !== undefined && obj[i].likedby.includes(uName))
                            likedText = "&#x2665;";
                        buttons.innerHTML = `
                            <div class="container">
                                <div class="row">
                                <div class="col-sm blogButton" onclick="blogRead('bl${obj[i].UUID}')" id="bl${obj[i].UUID}_read">Read</div> 
                                    <div class="col-sm blogButton" onclick="blogAction('likes', '${obj[i].UUID}')" id="bl${obj[i].UUID}_likes">${likedText} ${obj[i].likes}</div>
                                    <!-- Comments may be added later :> - may 
                                        <div class="col-sm blogButton" onclick="blogAction('comment', '${obj[i].UUID}')" id="bl${obj[i].UUID}_comment">comment</div>
                                    -->
                                </div>
                            </div>
                        `
                    

                        display.appendChild(elm);
                        display.appendChild(buttons);
                    }
                }, generalErrorCallback);
};
/**
 * if (activeElms.includes(obj[i].UUID)) {
                                cur.style.height = "150px";
                                cur.style.webkitMaskImage = "linear-gradient(180deg, #000 60%, transparent)";
                                cur.style.overflow = "hidden";
                                activeElms.splice(activeElms.indexOf(obj[i].UUID))
                            }
 */

let blogRead = (uid: string) => {
    let cur = document.getElementById(uid)!;
    let btn = document.getElementById(uid + "_read")!;
    if (activeElms.includes(uid)) {
        cur.style.height = "150px";
        cur.style.webkitMaskImage = "linear-gradient(180deg, #000 60%, transparent)";
        cur.style.overflow = "hidden";
        btn.innerText = "Read";
        activeElms.splice(activeElms.indexOf(uid))
    } else {
        cur.style.height = "600px";
        cur.style.overflow = "scroll";
        cur.style.webkitMaskImage = "";
        btn.innerText = "Close";
        activeElms.push(uid);
    }
};

let getBlogIndexByUUID = (uid:string) : number => {
    for (let bco in blogCache) {
        if (blogCache[bco].UUID == uid)
            return parseInt(bco);
    }
    return -1;
};

let getBlogByUUID = (uid: string) => {
    for (let bco in blogCache) {
        if (blogCache[bco].UUID == uid)
            return blogCache[bco];
    }
    return undefined;
};

let blogAction = (act:string, uid:string) => {
    console.log(`${act} - ${uid}`);
    switch (act) {
        case "likes":
            console.log("here");
            let uName = getCookie("username");
            let likeBtn = document.getElementById(`bl${uid}_likes`)!;
            let blog = getBlogByUUID(uid);
            if (blog === undefined) { return; } 
            if (uName === undefined) { return; }
            console.log("make REQUEST!");
            let index = getBlogIndexByUUID(uid);
            if (blog.likedby.includes(uName)) {
                HTTPRequest(`/api/post/like/revoke/${blog.UUID}`, "POST", "", () => {
                    blogCache[index].likedby = blogCache[index].likedby.replace(`${uName};`, '');
                    blogCache[index].likes --;
                    likeBtn.innerHTML = `&#x2661; ${blogCache[index].likes}`
                    console.log("here");
                }, generalErrorCallback);
                
            } else {
                HTTPRequest(`/api/post/like/${blog.UUID}`, "POST", "", () => {
                    blogCache[index].likedby += `${uName};`
                    blogCache[index].likes ++;
                    likeBtn.innerHTML = `&#x2665; ${blogCache[index].likes}`
                    console.log("here");
                }, generalErrorCallback);

            }
            break;
        case "comment":
            break;
    }
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