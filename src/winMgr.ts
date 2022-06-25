

class winManager {

    currentPageShown: string;
    pages: { [key: string]: HTMLElement | null }; // key: page name, value: page id

    constructor() {
        /**
         *  Content Layout:
         *      home    -> has daily/weekly announcements 
         *      about   -> general information about the site
         *      blog    -> long form posts (news/events/etc)
         *      clubs   -> place to join/learn about clubs & ask questions
         *      project -> fun club events/projects on going/upcoming in the school
         *      login/account -> account management stuff
         */
        this.currentPageShown = 'home';
        this.pages = {
            "home-view": document.getElementById('home-view'),
            "about-view": document.getElementById('about-view'),
            "projects-view": document.getElementById('projects-view'),
            "blog-view": document.getElementById('blog-view'),
            "clubs-view": document.getElementById('clubs-view'),
            "login-view": document.getElementById('login-view'),
            "account-view": document.getElementById('account-view'),
            "discussions-view": document.getElementById('discussions-view')
        };
    }

    hidePages(allBut: string="") {
        /**
         * Hide all pages except one (if specified) * optional
         */
        for (let key in this.pages) {
            if (key === allBut || this.pages[key] === null) {
                continue;
            }
            this.pages[key]!.style.display = 'none';
        }
    }


    changePage(page:string) {
        console.log(page);
        assert(page in this.pages, 'page does not exist');
        assert(this.pages[page] !== null, 'page is null', false);
        
        this.currentPageShown = page;
        this.hidePages(page);
        this.pages[page]!.style.display = 'block';
    }

};