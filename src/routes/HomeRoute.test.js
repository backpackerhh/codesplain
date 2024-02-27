import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";

const handlers = [
  rest.get("/api/repositories", (req, res, ctx) => {
    const language = req.url.searchParams.get("q").split("language:")[1];

    return res(
      ctx.json({
        items: [
          { id: 1, full_name: `${language}/a` },
          { id: 2, full_name: `${language}/b` },
        ],
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test("renders two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "ruby",
  ];

  for (const language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}/`),
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}/a`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}/a`);
    expect(links[1]).toHaveTextContent(`${language}/b`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}/b`);
  }
});
