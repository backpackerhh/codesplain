import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

jest.mock("../tree/FileIcon", () => {
  return () => {
    return "File Icon Component";
  };
});

test("shows a link to the GitHub homepage for a given repository", () => {
  const repository = {
    language: "JavaScript",
    full_name: "facebook/react",
    description: "React",
    owner: "facebook",
    name: "react",
    html_url: "https://github.com/facebook/react",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  const link = screen.getByRole("link", {
    name: /github repository/i,
  });

  expect(link).toHaveAttribute("href", repository.html_url);
});
