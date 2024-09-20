import "./App.css";
import Question from "./components/question.jsx";
import React from "react";
import { nanoid } from "nanoid";

function App() {
  const [loading, setLoading] = React.useState(true);
  const [check, setCheck] = React.useState(false);
  const [replay, setReplay] = React.useState(0);
  const [data, getData] = React.useState([]);
  const [mainQuestions, setMainQuestions] = React.useState([]);

  const [score, setScore] = React.useState(0);
  // const [mainQuestions, setMainQuestions] = React.useState([]);
  // const importantData = localData.results;
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
        getData(d.results);
        setMainQuestions(updatedQuestions);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Stop loading when fetch is complete
      }
    };
    fetchData();
  }, [replay]);

  console.log(data);
  // console.log(importantData);

  // const [mainQuestions, setMainQuestions] = React.useState(

  //   data.map((obj) => {
  //     return {
  //       ...obj,

  //       Qid: nanoid(),
  //       Answers: collectAnswers(obj.incorrect_answers, obj.correct_answer).map(
  //         (answer, i) => {
  //           return {
  //             id: nanoid(),
  //             value: answer,
  //             selected: false,
  //             isCorrect: answer === obj.correct_answer ? true : false,
  //           };
  //         }
  //       ),
  //     };
  //   })
  // );

  React.useEffect(() => {
    mainQuestions.forEach((Q) => {
      Q.Answers.forEach((a) => {
        if (a.isCorrect && a.selected) {
          setScore((s) => s + 1);
        }
      });
    });
  }, [check]);

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

  // function choose(e) {
  //   setMainQuestions((pQ) => {
  //     return pQ.map((Q) => {
  //       if (e.target.parentNode.parentNode.id === Q.Qid) {
  //         return {
  //           ...Q,
  //           Answers: Q.Answers.map((a) => {
  //             // console.log(e.target.parentNode.parentNode.id);
  //             return a.id === e.target.id
  //               ? { ...a, selected: !a.selected }
  //               : { ...a, selected: false };
  //           }),
  //         };
  //       } else {
  //         return Q;
  //       }
  //     });
  //   });
  // }

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
    setCheck(true);
    if (e.target.innerHTML === "replay") {
      setCheck(false);
      setReplay((pR) => pR + 1);
      setScore(0);
      setMainQuestions(
        data.map((obj) => {
          return {
            ...obj,
            Qid: nanoid(),
            Answers: collectAnswers(
              obj.incorrect_answers,
              obj.correct_answer
            ).map((answer, i) => {
              return {
                id: nanoid(),
                value: answer,
                selected: false,
                isCorrect: answer === obj.correct_answer ? true : false,
              };
            }),
          };
        })
      );
    }
  }

  // Show a loading screen until the fetching is finished
  if (loading) {
    return <p>Loading questions...</p>;
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

  return (
    <main>
      <div className="shape-one"></div>
      <div className="container">
        <div className="questions">{QuestionArray}</div>
        {check && <h2>your Score {score}</h2>}
        <button className="submit" onClick={click}>
          {!check ? "submit" : "replay"}
        </button>
      </div>
      <div className="shape-two"></div>
    </main>
  );
}

export default App;
