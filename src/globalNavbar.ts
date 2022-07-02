


class navbar {
    state: string;
    navbar: HTMLElement;
    elements: { [key: string]: string };
    winMgr: winManager;
    constructor(winMgr: winManager) {
        this.state = 'Home';
        this.navbar = document.getElementById('globalNavBar')!;

        this.elements = {
            "Home"          : "#home-view",
            "About"         : "#about-view",
            "Projects"      : "#projects-view",
            "Blog"          : "#blog-view",
            "Clubs"         : "#clubs-view",
            "Login"         : "#login-view",
            "Discussions"   : "#discussions-view",
            "Account"       : "#account-view",
            "Learn more"    : "#about-view"
        };

        this.winMgr = winMgr;

        this.initNavbar();
    }

    initNavbar() {
        // create navbar elements
        let generalNavbar = null;

        document.getElementById('globalNavBar')!.innerHTML = '';
        generalNavbar = document.createElement('nav');
        generalNavbar.classList.add('nav', 'nav-pills');
        generalNavbar.setAttribute('id', 'globalNavBar1');
        document.getElementById('globalNavBar')!.appendChild(generalNavbar);

        for (let key in this.elements) {
            if (key == "Login") { 
                let loginBtn = document.getElementById("login");
                loginBtn?.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    this.initNavbar();
                });
                continue;
            } else if (key == "Account") {
                let accountBtn = document.getElementById("account");
                accountBtn?.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    console.log(getCookie("user"))
                    getAccountDetails(getCookie("user"));
                    this.initNavbar();
                });
                continue;
            } else if (key == "Learn more") {
                let lmBtn = document.getElementById("learnMoreHome");
                lmBtn?.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    this.initNavbar();
                });
                continue;
            }
            let element = document.createElement('a');
            element.className = 'navbar-item nav-link text-center';
            
            // check if the current state is the same as the element
            if (this.state == key) {
                element.classList.add('active');
            }
            // pill toggle
            element.addEventListener('click', () => {
                this.state = key;
                let page = this.elements[key].replace('#', '');
                this.winMgr.changePage(page);
                this.initNavbar();
            });

            // set data-toggle
            element.setAttribute('data-toggle', 'pill');

            element.innerHTML = key;
            element.href = this.elements[key];
            generalNavbar.appendChild(element);
        }
        this.navbar.appendChild(generalNavbar);
    }
};