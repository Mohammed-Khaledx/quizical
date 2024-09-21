import "../App.css";

function Starter(props) {
  return (
    <div className="starter--container" >
      <button className="starter" onClick={props.toggle}>
        Start Quiz
      </button>
    </div>
  );
}

export default Starter;
