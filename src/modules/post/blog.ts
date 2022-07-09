
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