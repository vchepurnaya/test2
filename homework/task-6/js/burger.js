const btn = document.querySelector('.b-burger');
const nav = document.querySelector('.b-menu');


btn.addEventListener('click', function (e) {
    e.preventDefault();

    btn.classList.toggle('_active');
    nav.classList.toggle('_active');
});
