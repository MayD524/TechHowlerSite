

class winManager {

    currentPageShown: string;
    pages: { [key: string]: HTMLElement | null }; // key: page name, value: page id

    constructor() {
        this.currentPageShown = 'home';
        this.pages = {
            "home-view": document.getElementById('home-view'),
            "about-view": document.getElementById('about-view'),
            "contact-view": document.getElementById('contact-view'),
            "projects-view": document.getElementById('projects-view'),
            "blog-view": document.getElementById('blog-view'),
            "clubs-view": document.getElementById('clubs-view')
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