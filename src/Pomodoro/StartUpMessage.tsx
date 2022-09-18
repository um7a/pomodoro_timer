import "./StartUpMessage.css";

type StartUpMessageProps = {
  message: string;
};

function StartUpMessage(props: StartUpMessageProps) {
  return (
    <div className="StartUpMessage">
      <p>{props.message}</p>
    </div>
  );
}

export default StartUpMessage;
