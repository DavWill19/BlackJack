
//  black jack
let blackJackGame = {
    "you": {"scoreSpan": '#your-blackjack-result', "div": "#your-box", "score": 0,},
    "dealer": {"scoreSpan": '#dealer-blackjack-result', "div": "#dealer-box", "score": 0,},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStay': false,
    'turnsOver': false,
};
const logo = document.querySelector("#logo");
const YOU = blackJackGame['you'];
const DEALER = blackJackGame['dealer'];
const openSound = new Audio('sounds/open.wav');
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.wav');
const lossSound = new Audio('sounds/aww.wav');
const pulse = document.querySelector('#blackjack-result');

document.querySelector("#blackjack-hit-button").addEventListener('click', blackJackHit);
document.querySelector("#blackjack-stay-button").addEventListener('click', dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener('click', blackJackDeal);


SetTimeout(openSound.play(), 1000);


function blackJackHit() {
    if (blackJackGame['isStay'] === false) {
    logo.classList = ("");
    logo.classList.add("blackJ");
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU)
    console.log(YOU['score']);
    pulse.classList = ("");
    }
document.querySelector('#blackjack-result').style.color = "cornsilk";
};
function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackJackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
        if (activePlayer['score'] <= 21) {
       let cardImage = document.createElement('img');
       cardImage.src = `images/${card}.png`;
       cardImage.classList.add("animate__animated", "animate__backInDown");
       document.querySelector(activePlayer['div']).appendChild(cardImage);
       hitSound.play();
        }
}
function blackJackDeal() {
    if (blackJackGame['turnsOver'] === true) {
    let yourImages = document.querySelector("#your-box").querySelectorAll('img');
    let dealerImages = document.querySelector("#dealer-box").querySelectorAll('img');
    
    for (i=0; i < yourImages.length; i++) {
    yourImages[i].remove();
    }
    
    for (i=0; i < dealerImages.length; i++) {
    dealerImages[i].remove();
    }
    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector('#your-blackjack-result').textContent =0;
    document.querySelector('#dealer-blackjack-result').textContent =0;
    document.querySelector('#your-blackjack-result').classList.remove("busted");
    document.querySelector('#dealer-blackjack-result').classList.remove("busted");
    document.querySelector('#blackjack-result').classList.add("replay", "animate__animated", "animate__flash", "animate__infinite");
    logo.classList = ("blackJ animate__animated animate__pulse animate__infinite");
    document.querySelector('#blackjack-result').textContent = "Let's Play";
    blackJackGame['turnsOver'] = false;
    blackJackGame['isStay'] = false;
    confetti.stop();
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
     if (activePlayer['score'] + 11 <= 21){
        activePlayer['score'] +=  11;
    }   else {
        activePlayer['score'] += 1;
    }
    }   else {
    activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
        document.querySelector(activePlayer['scoreSpan']).classList.add("busted");
        sleep(1000);
        dealerLogic();
    }   else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }

}


async function dealerLogic() {
    blackJackGame['isStay'] = true;

    while (DEALER['score'] < 16 && blackJackGame['isStay'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackJackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner); 
        
    }

// compute winner and return who won
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackJackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackJackGame['losses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {
            blackJackGame['draws']++;
        }

    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
            blackJackGame['losses']++;
            winner = DEALER;
        
     } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
           blackJackGame['draws']++;
    }
    console.log(blackJackGame);

    return winner;

}

function showResult(winner) {
    let message, messageColor;
    if (blackJackGame['turnsOver'] === true) {

        if (winner === YOU){
            message = "You won!";
            messageColor = "green";
            winSound.play();
            confetti.start();
        }
        else if (winner === DEALER){
            message = "You lost!";
            messageColor = "red";
            lossSound.play();
        }
        else {
            message = "Draw!";
            messageColor = "black";
        }
        document.querySelector('#wins').textContent = blackJackGame['wins'];
        document.querySelector('#losses').textContent = blackJackGame['losses'];
        document.querySelector('#draws').textContent = blackJackGame['draws'];
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        pulse.classList.add("animate__animated", "animate__flash", "animate__infinite");
    }
}


