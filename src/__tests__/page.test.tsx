import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "../app/ui/sidenav/sidenav";

// Mock dla next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock dla next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/pl/announcements",
}));

describe("Nav component", () => {
  it("renders logo text", () => {
    render(<Nav />);
    expect(screen.getByText("CargoLink")).toBeInTheDocument();
  });

  it("shows mobile menu on hamburger click", async () => {
    render(<Nav />);
    const hamburgerButton = screen.getByTestId("menu-button");

    // Menu powinno być początkowo ukryte na mobile
    expect(screen.getByTestId("side-menu")).toHaveClass("hidden");

    // Kliknięcie w hamburger
    fireEvent.click(hamburgerButton);

    // Menu powinno być widoczne
    expect(screen.getByTestId("side-menu")).not.toHaveClass("hidden");
  });

  it("shows correct path name in mobile view", () => {
    render(<Nav />);
    expect(screen.getByText("announcements")).toBeInTheDocument();
  });

  it("hides menu by default on mobile", () => {
    render(<Nav />);
    const sideMenu = screen.getByTestId("side-menu");
    expect(sideMenu).toHaveClass("hidden");
  });

  it("closes menu when clicking outside", () => {
    render(<Nav />);
    const hamburgerButton = screen.getByTestId("menu-button");
    const overlay = screen.getByTestId("menu-overlay");

    // Otwieramy menu
    fireEvent.click(hamburgerButton);
    expect(screen.getByTestId("side-menu")).not.toHaveClass("hidden");

    // Klikamy w overlay
    fireEvent.click(overlay);
    expect(screen.getByTestId("side-menu")).toHaveClass("hidden");
  });

  it("is always visible on desktop", () => {
    // Mockujemy szerokość ekranu na desktop
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));

    render(<Nav />);
    const sideMenu = screen.getByTestId("side-menu");
    expect(sideMenu).toHaveClass("md:flex");
  });
});
