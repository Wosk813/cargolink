import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/[locale]/page";
import { NextIntlClientProvider } from "next-intl";

const mockMessages = { HomePage: { title: "Test Title" } };

test("Page", () => {
  render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      <Page />
    </NextIntlClientProvider>
  );

  expect(
    screen.getByRole("heading", { level: 1, name: "Test Title" })
  ).toBeDefined();
});
