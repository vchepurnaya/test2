'use strict'

const endPointGetUsers = 'https://randomuser.me/api/?results=10';
const endPointRemoveUsers = 'https://httpstat.us/200';

const userRequest = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endPointGetUsers);
    xhr.onload = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    code: xhr.status,
                    message: xhr.statusText
                })
            }
        }
    }
    xhr.send();
});


userRequest.then(
    ({results}) => {
        console.log(results);
        createListItem(results);
        assignListener();
    },
    err => {
        console.log(err);
    }
);


function createListItem(users) {
    const ul = document.createElement('ul');
    const cont = document.querySelector('.container');
    ul.classList.add('l-users');

    users.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('l-users__item');
        li.innerHTML = `
                <div class="b-user">
                    <div class="b-user__background${item.gender === 'male' ? '_male' : '_female'}"></div>
                        <button class="b-user__btn-close"></button>
                        <img src="${item.picture.large}" alt="${item.name.last}" class="b-user__photo">
                        <p class="b-user__name">${item.name.title + ' ' + item.name.first + ' ' + item.name.last}</p>
                        <div class="b-user__mail">
                            <a href="#" class="b-user__mail-link">${item.email}</a>
                        </div>
                </div>
`;
        ul.appendChild(li);
    })

    cont.appendChild(ul);
}


function assignListener() {
    const usersList = document.querySelector('.l-users');

    usersList.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'button') {
            removeListItem(e.target);
        }
    });
}


function removeListItem(element) {
    const id = element.dataset.id;

    fetch(endPointRemoveUsers, {
        method: 'POST',
        body: JSON.stringify({id})
    })
        .then(res => {
            console.log(res);

            if (res.ok) {
                element.parentNode.parentNode.remove();
            }
        })
}
