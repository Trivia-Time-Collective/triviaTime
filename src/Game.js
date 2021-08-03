import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import swal from 'sweetalert';

const Game = ({ listOfUsers }) => {
  const [questionsArray, setQuestionsArray] = useState([]);
  const [choices, setChoices] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roundCounter, setRoundCounter] = useState(0);
  const [turnCounter, setTurnCounter] = useState(0);
  const [score, setScore] = useState(0);

  const history = useHistory();

  const { category, difficulty, questionType } = useParams();
  console.log(category, difficulty, questionType);

  const checkAnswer = (buttonValue) => {
    console.log(buttonValue);

    if (buttonValue === answer) {
      listOfUsers[turnCounter].points += 1;
      setScore(listOfUsers[turnCounter].points);
    }
    if (roundCounter < 9) {
      setRoundCounter(roundCounter + 1);
    } else {
      swal(
        'Round Complete!',
        `Your score was ${listOfUsers[turnCounter].points}.`
      );
      setRoundCounter(0);
      setScore(0);
      if (turnCounter < listOfUsers.length - 1) {
        setTurnCounter(turnCounter + 1);
      } else {
        history.push('/gamesummary');
      }
    }
  };

  useEffect(() => {
    axios({
      url: `https://opentdb.com/api.php`,
      method: 'GET',
      dataResponse: 'json',
      params: {
        amount: 10,
        category: category,
        difficulty: difficulty,
        type: questionType,
      },
    }).then((res) => {
      setQuestionsArray(res.data.results);
      console.log(res.data.results);
      setIsLoaded(true);
    });
  }, [category, difficulty, questionType]);

  useEffect(() => {
    if (isLoaded) {
      setChoices([
        ...questionsArray[roundCounter].incorrect_answers,
        questionsArray[roundCounter].correct_answer,
      ]);
      setAnswer(questionsArray[roundCounter].correct_answer);
    }
  }, [roundCounter, isLoaded, questionsArray]);

  return !isLoaded ? (
    <div>
      <h2>Loading...</h2>
    </div>
  ) : (
    <div className="gamePage">
      <div className="currentUser">
        <p>{`${listOfUsers[turnCounter].username}'s turn`}</p>
        <p>Score: {score}</p>
      </div>
      <h3
        dangerouslySetInnerHTML={{
          __html: questionsArray[roundCounter].question,
        }}
      ></h3>
      <div className="triviaChoiceContainer">
        {choices.map((choice, index) => {
          return (
            <button
              key={index}
              className="triviaChoice"
              onClick={() => checkAnswer(choice)}
              dangerouslySetInnerHTML={{ __html: choice }}
            ></button>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
