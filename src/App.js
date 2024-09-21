import "./App.css";
import Question from "./components/question.jsx";
import React from "react";
import { nanoid } from "nanoid";
import Starter from "./components/starter.jsx";

function App() {
  const [start, setStart] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [replay, setReplay] = React.useState(0);
  const [mainQuestions, setMainQuestions] = React.useState([]);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy"
        );
        const d = await response.json();
        const updatedQuestions = d.results.map((obj) => ({
          ...obj,
          Qid: nanoid(),
          Answers: collectAnswers(
            obj.incorrect_answers,
            obj.correct_answer
          ).map((answer) => ({
            id: nanoid(),
            value: answer,
            selected: false,
            isCorrect: answer === obj.correct_answer,
          })),
        }));

        setMainQuestions(updatedQuestions);
        setLoading(false); // Stop loading when fetch is complete
      } catch (error) {
        
          console.error("Error:", error);
          setLoading(true);
        
      }
    };
    fetchData();
  }, [replay]);

  // Function to calculate score
  function calculateScore() {
    let newScore = 0;
    mainQuestions.forEach((q) => {
      q.Answers.forEach((a) => {
        if (a.isCorrect && a.selected) {
          newScore += 1;
        }
      });
    });
    setScore(newScore);
  }



  console.log(score);

  function collectAnswers(arr, e) {
    let newArr = [...arr];
    // let c = newArr.concat(arr);
    const randElement = Math.floor(Math.random() * 4);
    if (!newArr.includes(e)) {
      newArr.splice(randElement, 0, e);
    }
    return newArr;
  }

  function choose(e) {
    const questionId = e.target.parentNode.parentNode.id; // Get question's unique ID
    const answerId = e.target.id; // Get clicked answer's unique ID

    setMainQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        // Only update the question that was clicked
        if (question.Qid === questionId) {
          // Map through answers and update only the clicked answer
          const updatedAnswers = question.Answers.map((answer) =>
            answer.id === answerId
              ? { ...answer, selected: !answer.selected }
              : { ...answer, selected: false }
          );

          // Return the updated question with new answers
          return {
            ...question,
            Answers: updatedAnswers,
          };
        }

        // For other questions, return them as they are
        return question;
      });
    });
  }

  // console.log(mainQuestions);

  function click(e) {
    if (e.target.innerHTML === "submit") {
      setCheck(true);
      calculateScore();
    } else {
      setLoading(true);
      setCheck(false);
      setReplay((pR) => pR + 1);
      setScore(0);
    }
  }


  const QuestionArray = mainQuestions.map((q) => {
    return (
      <Question
        id={q.Qid}
        key={q.Qid}
        question={q.question}
        Answers={q.Answers}
        correctAnswer={q.correct_answer}
        check={check}
        choose={choose}
      />
    );
  });

  function toggle() {
    setStart(true);
  }

  if (!start) {
    return <Starter toggle={toggle} />;
  }
    // Show a loading screen until the fetching is finished
    if (loading && start === true) {
      return <p>Loading questions...</p>;
    }
  
  return (
    <main>
      <div className="shape-one"></div>
      <div className="container">
        <div className="questions">{QuestionArray}</div>
        <div className="result">
          <button className="submit" onClick={click}>
            {!check ? "submit" : "replay"}
          </button>
          {check && <h3 className="score">your Score {score}</h3>}
        </div>
      </div>
      <div className="shape-two"></div>
    </main>
  );
}

export default App;
