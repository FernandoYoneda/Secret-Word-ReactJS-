//CSS
import './App.css';

//React
import{useCallback, useEffect, useState} from "react" 

//Data
import {wordList} from "./data/words"

//Component
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages= [
  {id:'1', name:'Start'},
  {id:'2', name:'Game'},
  {id:'3', name:'End'}
]

const guessesQty = 3

function App() {
const [gameStage, setGameStage] = useState(stages[0].name)
const [words] = useState(wordList)

const [pickedWord, setPickedWord] = useState("")
const [pickedCategory, setPickedCategory] = useState("")
const [letters, setLetters] = useState([])

const [guessedLetters, setGuessedLetters] = useState([])
const [wrongLetters, setWrongLetters] = useState([])
const [guesses, setGuesses] = useState(guessesQty)
const [score, setScore] = useState(0)

const pickWordAndCategory = useCallback( () => {
  //pick a radom category
  const categories = Object.keys(words)
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

  //pick a radom word

  const word = words[category][Math.floor(Math.random() * words[category].length)]

  return{word, category}
}, [words])

//Start the secret words game
const startGame = useCallback(() => {
  //clear all letters
  clearLetterStates()
  //pick word and category
  const{word, category} = pickWordAndCategory()

  //Create an array of letters
  let wordLetters =word.split("")

  wordLetters = wordLetters.map((l) => l.toLowerCase())

  //fill states
  setPickedWord(word)
  setPickedCategory(category)
  setLetters(wordLetters)

  setGameStage(stages[1].name)
}, [pickWordAndCategory])

//Process the letter input
const verifyLetter = (letter) => {
  const normalizedLetter = letter.toLowerCase()

  //ckeck if letter has already been ultilized
  if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
    return
  }

  //push guessed letter or remove aguess
  if (letters.includes(normalizedLetter)) {
    setGuessedLetters((actualGueseedLetters) => [
      ...actualGueseedLetters,
      normalizedLetter
    ])
  } else {
    setWrongLetters((actualWrongLetters) => [
      ...actualWrongLetters,
      normalizedLetter
    ])

    setGuesses((actualGuesses) => actualGuesses -1)
  }

}

const clearLetterStates = () => {
  setGuessedLetters([])
  setWrongLetters([])
} 

//check if guesses ended
useEffect(() => {
  if(guesses <= 0) {
    //reset all states
    clearLetterStates()

    setGameStage(stages[2].name)
  }
}, [guesses])

//check win condition
useEffect(() => {
  const uniqueLetters = [...new Set(letters)]

  //win condition
  if (guessedLetters.length === uniqueLetters.length) {
    //add score
    setScore((actualScore) => (actualScore += 100))

    //restart game with new word
    startGame()
  }
},[guessedLetters, letters, startGame])

//Restart the game
const retry = () => {
  setScore(0)
  setGuesses(guessesQty)

  setGameStage(stages[0].name)
}

  return (
    <div className="App">
      {gameStage === 'Start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'Game' && 
      <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses} 
      score={score}
      />}
      {gameStage === 'End' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
