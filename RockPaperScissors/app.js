//The javascript file contains the game logic for RPS and updates the web page respctively

const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
const resultDisplay = document.getElementById('result')//these three const are reference to the <span> elements in html and will display computer and user choice and result
const possibleChoices = document.querySelectorAll('button')//this is a node list referencing all the buttons on the page
let userChoice
let computerChoice //these three variables store the users choice, the computers choice and the result data
let result

possibleChoices.forEach(button => button.addEventListener('click', (e) => {
    userChoice = e.target.id
    userChoiceDisplay.innerHTML = userChoice
    generateComputerChoice()
    getResult()

}))

function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * possibleChoices.length) + 1
    
    switch (randomNumber) {
        case 1:
            computerChoice = "rock"
            break
        case 2:
            computerChoice = "scissors"
            break
        case 3:
            computerChoice = "paper"
            break
    }
    computerChoiceDisplay.innerHTML = computerChoice

}

function getResult() {

    switch (computerChoice) {
        case userChoice:
            result = "It's a draw!"
            break
        case "rock":
            result = userChoice === "paper" ? "You win!": "You lose!"
            break
        case "paper":
            result = userChoice === "scissors" ? "You win!": "You lose!"
            break
        case "scissors":
            result = userChoice === "rock" ? "You win!": "You lose!"
            break
    }

    resultDisplay.innerHTML = result
}