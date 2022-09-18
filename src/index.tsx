import ReactDOM from "react-dom/client";

import "./index.css";
import Pomodoro from "./Pomodoro/Pomodoro";
import Preference from "./Preference/Preference";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const decideRoute = () => {
  const search = window.location.search;
  if (search === "?route=main") {
    return <Pomodoro />;
  }
  if (search === "?route=preference") {
    return <Preference />;
  }
};

root.render(decideRoute());
