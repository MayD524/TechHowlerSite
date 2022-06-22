


class navbar {
    state: string;
    navbar: HTMLElement;
    elements: { [key: string]: string };
    winMgr: winManager;
    constructor(winMgr: winManager) {
        this.state = 'Home';
        this.navbar = document.getElementById('globalNavBar')!;

        this.elements = {
            "Home"    : "#home-view",
            "About"   : "#about-view",
            "Contact" : "#contact-view",
            "Projects": "#projects-view",
            "Blog"    : "#blog-view",
            "Clubs"   : "#clubs-view"
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