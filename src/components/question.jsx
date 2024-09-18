import "../App.css";
import React from "react";

function Question(props) {
  const answersElements = props.Answers.map((a, i) => {
    let cn = "";
    if (a.selected && !props.check) {
      cn = "selected";
    } else if (props.check && a.isCorrect) {
      cn = "true";
    } else if (props.check && !a.isCorrect && a.selected) {
      cn = "false";
    }
    return (
      <span className="answer">
        <button id={a.id} onClick={props.choose} className={cn}>
          {a.value}
        </button>
      </span>
    );
  });

  return (
    <div className="question">
      <h3 className="question-text">{props.question}</h3>
      <div className="answers" id={props.id} key={props.id}>
        {answersElements}
      </div>
    </div>
  );
}
export default Question;
