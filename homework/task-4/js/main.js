const graveyard = document.querySelector('.b-shooter');
const shooter = document.querySelector('.b-shooter__aim');
const imgOfShooter = document.querySelector('.b-shooter__img-aim');
const ghost = document.querySelector('.b-shooter__img-ghost');
const fire = document.querySelector('.b-shooter__img-fire');
const progress = document.querySelectorAll('.b-shooter__progress-icon');
const health = document.querySelectorAll('.b-shooter__health-icon');
const lifeStatus = document.querySelector('.b-shooter__health');
const finalTitle = document.querySelector('.b-shooter__game-over-title');

const delayToReset = 500;
const animation = `opacity: 0;
                 transition-delay: ${delayToReset * .4}ms;
                 transition-duration: ${delayToReset * .6}ms;`

let isGameOver = false;

const markProgress = markProgressOut();
const markLifeStatus = markLifeStatusOut();

graveyard.addEventListener('click', e => {
    if (
        ghost.style.animationPlayState === 'paused'
        || isGameOver
    ) {
        return
    }

    let x = e.offsetX - shooter.offsetWidth / 2;
    let y = e.offsetY - shooter.offsetHeight / 2;
    const limitX = e.currentTarget.offsetWidth - shooter.offsetWidth;
    const limitY = e.currentTarget.offsetHeight - shooter.offsetHeight;

    if (x < 0) {
        x = 0;

    } else if (x > limitX) {
        x = limitX;
    }

    if (y < 0) {
        y = 0;

    } else if (y > limitY) {
        y = limitY;
    }

    shooter.style.transform = `translate(${x}px, ${y}px)`;
});

document.body.addEventListener('keydown', e => {
    if (e.code === 'Space' && !isGameOver) {
        e.preventDefault();
        imgOfShooter.style.transform = 'scale(0.9)';
    }
});

document.body.addEventListener('keyup', e => {
    if (e.key === 'Enter' && isGameOver) {
        return reset();

    } else if (fire.style.visibility === 'visible' || e.code !== 'Space'  || isGameOver  ) {
        return;
    }

    imgOfShooter.style.transform = '';

    const rectGhost = ghost.getBoundingClientRect();
    const rectShooter = shooter.getBoundingClientRect();
    const aimCenterX = rectShooter.x + rectShooter.width / 2;
    const aimCenterY = rectShooter.y + rectShooter.height / 2;

    if (aimCenterY >= rectGhost.top + 20 &&
        aimCenterY <= rectGhost.bottom - 20 &&
        aimCenterX >= rectGhost.left + 20 &&
        aimCenterX <= rectGhost.right - 20) {

        setAnimation();
        setTimeout(resetAnimation, delayToReset);
        markProgress.getNext();
    }
});

function setAnimation() {
    fire.style.cssText += animation + 'visibility: visible;';
    ghost.style.cssText += animation + 'animation-play-state: paused;';
    imgOfShooter.style.display = 'none';
}

function resetAnimation() {
    if (isGameOver) {
        dropTheCurtain(true)

    } else {
        fire.removeAttribute('style');

        ghost.removeAttribute('style');
        ghost.style.display = 'none';

        imgOfShooter.style.display = '';
    }
}

function setRandomCoords() {
    const x = Math.floor(Math.random() * (graveyard.offsetWidth - ghost.offsetWidth));
    const y = Math.floor(Math.random() * (graveyard.offsetHeight - ghost.offsetHeight));

    ghost.style.left = x + 'px';
    ghost.style.top = y + 'px';
}

function setIntervalForGhost() {
    if (
        ghost.style.animationPlayState === 'paused' || isGameOver) {
        return;
    }

    if (ghost.style.display === 'none') {
        ghost.style.display = '';
        setRandomCoords();

    } else {
        setRandomCoords();
        markLifeStatus.getNext();
    }
}

setInterval(setIntervalForGhost, 3000);

function markProgressOut() {
    let i = 0;
    const lastElementIndex = progress.length - 1;

    return {
        getNext: () => {
            progress[i].classList.add('_progress');
            if (i === lastElementIndex) {
                isGameOver = true;
            }
            i++;
        },
        reset: () => {
            for (let icon of progress) {
                icon.classList.remove('_progress');
            }

            i = 0;
        }
    }
};

function markLifeStatusOut() {
    let i = 0;
    const lastElementIndex = health.length - 1;

    return {
        getNext: () => {
            if (lifeStatus.classList.contains('_blink')) {
                isGameOver = true;
                dropTheCurtain(false);

                return;
            }

            health[i].classList.add('_health');

            if (i === lastElementIndex) {
                lifeStatus.classList.add('_blink');
            }
            i++;
        },
        reset: () => {
            for (let icon of health) {
                icon.classList.remove('_health');
            }
            i = 0;
        }
    }
};

function dropTheCurtain(isWin) {
    if (isWin) {
        graveyard.classList.add('_win');
        finalTitle.innerText = 'You win';

    } else {
        finalTitle.innerText = 'You lose';
        graveyard.classList.add('_lose');
        ghost.removeAttribute('style');
    }
}

function reset() {
    isGameOver = false;
    graveyard.classList.remove('_lose');
    graveyard.classList.remove('_win');
    imgOfShooter.removeAttribute('style');
    fire.removeAttribute('style');
    ghost.removeAttribute('style');
    ghost.style.display = 'none';
    markProgress.reset();
    markLifeStatus.reset();
    lifeStatus.classList.remove('_blink');
}
