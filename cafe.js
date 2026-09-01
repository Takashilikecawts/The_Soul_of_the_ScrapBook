/* =====================================================
   COIN SYSTEM
===================================================== */

let coins = Number(localStorage.getItem("cafeCoins")) || 0;


/* =====================================================
   ORDERS
===================================================== */

const orders = [
    {
        type: "normal",
        customer: "🐈",
        name: "Mochi",
        question: "I'd like a strawberry cake, please! 🍓",
        choices: [
            "🍰 Strawberry Cake",
            "☕ Coffee",
            "🍵 Matcha",
            "🧃 Juice"
        ],
        answer: "🍰 Strawberry Cake",
        reward: 30
    },

    {
        type: "normal",
        customer: "🐕",
        name: "Biscuit",
        question: "Could I have a warm cup of coffee? ☕",
        choices: [
            "🍰 Cake",
            "☕ Coffee",
            "🍵 Matcha",
            "🥤 Soda"
        ],
        answer: "☕ Coffee",
        reward: 30
    },

    {
        type: "riddle",
        customer: "👻",
        name: "Misty",
        question: "I'm warm, brown, and people often drink me in the morning. What am I?",
        choices: [
            "🍰 Cake",
            "☕ Coffee",
            "🧃 Juice",
            "🍵 Tea"
        ],
        answer: "☕ Coffee",
        reward: 40
    },

    {
        type: "riddle",
        customer: "🌱",
        name: "Sprout",
        question: "I'm green, creamy, and popular in cafés. What am I?",
        choices: [
            "🍵 Matcha",
            "🍫 Hot Chocolate",
            "☕ Coffee",
            "🍰 Cake"
        ],
        answer: "🍵 Matcha",
        reward: 40
    },

    {
        type: "mystery",
        customer: "🦊",
        name: "Maple",
        question: "Bring me something sweet and covered in frosting! 🧁",
        choices: [
            "☕ Coffee",
            "🍰 Cake",
            "🍵 Tea",
            "💧 Water"
        ],
        answer: "🍰 Cake",
        reward: 35
    },

    {
        type: "mystery",
        customer: "🦉",
        name: "Olive",
        question: "I don't want coffee, cake, tea, or juice. What should you do?",
        choices: [
            "☕ Give Coffee",
            "🍰 Give Cake",
            "💬 Ask What They Want",
            "🚪 Send Them Away"
        ],
        answer: "💬 Ask What They Want",
        reward: 50
    },

    {
        type: "riddle",
        customer: "👻",
        name: "Unknown Customer",
        question: "I am cold, sweet, and disappear quickly on a sunny day. What am I?",
        choices: [
            "🍦 Ice Cream",
            "☕ Coffee",
            "🍵 Tea",
            "🍰 Cake"
        ],
        answer: "🍦 Ice Cream",
        reward: 45
    },

    {
        type: "riddle",
        customer: "🕯️",
        name: "The Quiet Customer",
        question: "What is something a person might keep inside a scrapbook?",
        choices: [
            "💭 Memories",
            "🪑 Tables",
            "💰 Coins",
            "☕ Coffee"
        ],
        answer: "💭 Memories",
        reward: 45
    }
];


/* =====================================================
   CURRENT ORDER
===================================================== */

let currentOrder = null;
let answeredCurrentOrder = false;


/* =====================================================
   ELEMENTS
===================================================== */

const customerElement = document.getElementById("customer");
const customerNameElement = document.getElementById("customerName");
const orderElement = document.getElementById("order");
const choicesElement = document.getElementById("choices");
const resultElement = document.getElementById("result");

const coinsElement = document.getElementById("coins");
const navCoinsElement = document.getElementById("navCoins");
const progressCoinsElement = document.getElementById("progressCoins");
const progressElement = document.getElementById("progress");

const secretTextElement = document.getElementById("secretText");
const secretButtonElement = document.getElementById("secretButton");
const nextCustomerButton = document.getElementById("nextCustomerButton");


/* =====================================================
   START NEW CUSTOMER
===================================================== */

function newCustomer() {
    currentOrder =
        orders[Math.floor(Math.random() * orders.length)];

    answeredCurrentOrder = false;

    customerElement.textContent =
        currentOrder.customer;

    customerNameElement.textContent =
        `${currentOrder.name} is waiting for their order`;

    orderElement.textContent =
        currentOrder.question;

    resultElement.textContent = "";
    resultElement.style.color = "";

    choicesElement.innerHTML = "";

    currentOrder.choices.forEach(function(choice) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = choice;

        button.addEventListener("click", function() {
            checkAnswer(choice);
        });

        choicesElement.appendChild(button);
    });
}


/* =====================================================
   CHECK ANSWER
===================================================== */

function checkAnswer(choice) {
    if (!currentOrder || answeredCurrentOrder) {
        return;
    }

    if (choice === currentOrder.answer) {
        answeredCurrentOrder = true;

        coins += currentOrder.reward;

        resultElement.textContent =
            `✅ Correct! +${currentOrder.reward} coins!`;

        resultElement.style.color = "green";

        saveCoins();
        updateDisplay();
        checkSecret();

        disableChoices();
    } else {
        resultElement.textContent =
            "❌ Not quite! Try another answer.";

        resultElement.style.color = "crimson";
    }
}


/* =====================================================
   DISABLE ANSWERS
===================================================== */

function disableChoices() {
    const buttons =
        choicesElement.querySelectorAll("button");

    buttons.forEach(function(button) {
        button.disabled = true;
    });
}


/* =====================================================
   SAVE COINS
===================================================== */

function saveCoins() {
    localStorage.setItem("cafeCoins", coins);
}


/* =====================================================
   UPDATE SCREEN
===================================================== */

function updateDisplay() {
    coinsElement.textContent =
        coins.toLocaleString();

    navCoinsElement.textContent =
        coins.toLocaleString();

    progressCoinsElement.textContent =
        coins.toLocaleString();

    let percentage =
        (coins / 100000) * 100;

    if (percentage > 100) {
        percentage = 100;
    }

    progressElement.style.width =
        `${percentage}%`;
}


/* =====================================================
   SECRET ENDING
===================================================== */

function checkSecret() {
    if (coins >= 100000) {
        secretTextElement.textContent =
            "👻 The café suddenly becomes silent... You finally remember.";

        secretButtonElement.style.display =
            "inline-block";
    }
}


/* =====================================================
   UNLOCK AFTERLIFE
===================================================== */

function unlockEnding() {
    localStorage.setItem(
        "afterlifeUnlocked",
        "true"
    );

    window.location.href =
        "afterlife.html";
}


/* =====================================================
   EVENT LISTENERS
===================================================== */

nextCustomerButton.addEventListener(
    "click",
    newCustomer
);

secretButtonElement.addEventListener(
    "click",
    unlockEnding
);


/* =====================================================
   START GAME
===================================================== */

updateDisplay();
checkSecret();
newCustomer();