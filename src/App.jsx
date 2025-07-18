import {languages} from './languages.js';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import {getRandomWord, getFarewellText} from './utils.js';
import clsx from 'clsx';

const App = () => {
  const [word, setWord] = useState(() => getRandomWord().toUpperCase());
  // const [word, setWord] = useState("REACT");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const wrongGuessCount = guessedLetters.filter(letter => !word.includes(letter)).length;
  const isGameWon = word.split("").every(letter => guessedLetters.includes(letter));
  const isGameOver = wrongGuessCount >= languages.length-1;
  const [farewell, setFarewell] = useState("");

  function handleGuess(letter) {
    setGuessedLetters((prev) => prev.includes(letter) ? prev : [...prev, letter])

  }

  useEffect(() => {
    if (wrongGuessCount<1){
      setFarewell("");
    }else{
      setFarewell(getFarewellText(languages[wrongGuessCount-1]?.name || ""))
    }
  }, [wrongGuessCount]);

  function restart() {
    setWord(getRandomWord().toUpperCase());
    setGuessedLetters([]);
    setFarewell("");
  }


  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Save Language</h1>
        <p>Guess the word within 8 attemps to keep the programming world safe from Assembly</p>
      </header>

      <section className={clsx('game-status', isGameOver && "lost", isGameWon && "won", !isGameOver && !isGameWon && wrongGuessCount>0 && "farewell")}>
        {isGameWon && <>
          <h2>Congratulations!</h2>
          <p>You saved the rest languages!</p>
        </>}
        {isGameOver && <>
          <h2>You L00ser</h2>
          <p>Start working on Assembly</p>
        </>}
        {!isGameOver && !isGameWon &&
          <p>{wrongGuessCount>0 && farewell}</p>
        }
      </section>

      <section className='language-chips'>
        {languages.map((lang, index) => (
          <span key={lang.name} className={clsx('chip', index<wrongGuessCount && "lost")} style={{backgroundColor: lang.backgroundColor, color: lang.color}}>{lang.name}</span>
      ))}
      </section>

      <section className="word">
        {word.split("").map((letter, index) => {
          return <span key={index} className={clsx(isGameOver && !guessedLetters.includes(letter) && "missed-letter")}>
            {isGameOver || guessedLetters.includes(letter) ? letter : "_"}
          </span>
        })}
      </section>

      <section className="keyboard">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const isGussed = guessedLetters.includes(letter);
          const isCorrect = word.includes(letter);
          const isWrong = !word.includes(letter);
          return <button key={letter} onClick={() => handleGuess(letter)} className={clsx({correct: isGussed&&isCorrect, wrong: isGussed&&isWrong})} disabled={isGameOver||isGameWon}>{letter}</button>
        })}
      </section>

      {(isGameOver || isGameWon) && <button className="new-game" onClick={restart}>NEW GAME</button>}
    </main>
  )
}

export default App