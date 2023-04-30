import { render, screen } from "@testing-library/react";
import Label from "./Label";

const LABEL = {
  work: "Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

test(`renders ${LABEL.work} label`, async () => {
  render(<Label isWorking={true} isLongBreak={false} fontColor={0xffffff} />);
  const elements = await screen.findAllByText(new RegExp(LABEL.work));
  expect(elements.length).toBe(1);
  expect(elements[0]).toBeInTheDocument();
});

test(`renders ${LABEL.shortBreak} label`, async () => {
  render(<Label isWorking={false} isLongBreak={false} fontColor={0xffffff} />);
  const elements = await screen.findAllByText(new RegExp(LABEL.shortBreak));
  expect(elements.length).toBe(1);
  expect(elements[0]).toBeInTheDocument();
});

test(`renders ${LABEL.longBreak} label`, async () => {
  render(<Label isWorking={false} isLongBreak={true} fontColor={0xffffff} />);
  const elements = await screen.findAllByText(new RegExp(LABEL.longBreak));
  expect(elements.length).toBe(1);
  expect(elements[0]).toBeInTheDocument();
});
