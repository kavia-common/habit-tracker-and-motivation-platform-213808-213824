import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders HabitHive dashboard", () => {
  render(<App />);
  expect(screen.getByText(/HabitHive/i)).toBeInTheDocument();
  expect(screen.getByText(/Weekly progress/i)).toBeInTheDocument();
});
