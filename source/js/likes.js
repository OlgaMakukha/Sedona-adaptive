let like = document.querySelector('.btn-like');
let likesNumber = document.querySelector('.likes-number');

like.onclick = function () {
    if (like.classList.contains('btn-like-add')) {
        likesNumber.textContent--;
    } else {
        likesNumber.textContent++;
    }
    like.classList.toggle('btn-like-add');
};



