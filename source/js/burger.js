let toggleNav = document.querySelector('.main-nav__toggle');

toggleNav.onclick = function() {
    let mainNav = document.querySelector('.main-nav');
    
        mainNav.classList.toggle('main-nav__closed');
        mainNav.classList.toggle('main-nav__opened');
}