const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById('timer');
const wpm = document.getElementById('wpm');
const best = document.getElementById('best');
const button = document.getElementById('skip');


button.addEventListener('click', () => {
    renderNewQuote();
})

document.addEventListener("keydown", handleShortcut);
function handleShortcut(event) {
    if (event.altKey && event.key === "n") {
        event.preventDefault();
        renderNewQuote();
    }
}
quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    const arraySentence = quoteDisplayElement.innerText;
    if (arrayValue.length == 1) {
        startTimer();
    }
    let correct = true;
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    
    })
    
    if (correct) {
        wpm.innerText = Math.floor((arraySentence.split(' ').length / Number(timerElement.innerText)) * 60);
        if (wpm.innerText > Number(best.innerText)) {
            best.innerText = wpm.innerText;
        }
        renderNewQuote();
    }
})


function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

var timerHandle;
async function renderNewQuote() {
    clearInterval(timerHandle);
    timerElement.innerText = 0;
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
}

let startTime;
function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    timerHandle = setInterval(() => {
        timer.innerText = getTimerTime()
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000);
}

renderNewQuote();
