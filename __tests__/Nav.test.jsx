import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Nav from '@/src/app/ui/nav/nav';

const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useParams: () => ({}),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

const messages = {
  nav: {
    announcements: 'Planowane trasy',
    errands: 'Zlecenia',
    searchUser: 'Wyszukaj użytkownika',
    login: 'Zaloguj się',
  },
};

describe('Nav', () => {
  beforeEach(() => {
    // Ustaw domyślną wartość dla mockUsePathname przed każdym testem
    mockUsePathname.mockReturnValue('/pl/announcements');
  });
  it('renders a heading', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('CargoLink');
  });

  it('mobile menu is initially hidden', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const sideMenu = screen.getByTestId('side-menu');
    expect(sideMenu).toHaveClass('hidden');
    expect(screen.queryByTestId('menu-overlay')).not.toBeInTheDocument();
  });

  it('opens mobile menu when hamburger icon is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    const sideMenu = screen.getByTestId('side-menu');
    const menuOverlay = screen.getByTestId('menu-overlay');

    expect(sideMenu).not.toHaveClass('hidden');
    expect(sideMenu).toHaveClass('fixed');
    expect(menuOverlay).toBeInTheDocument();
  });

  it('closes mobile menu when overlay is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);

    const menuOverlay = screen.getByTestId('menu-overlay');
    fireEvent.click(menuOverlay);

    const sideMenu = screen.getByTestId('side-menu');
    expect(sideMenu).toHaveClass('hidden');
    expect(screen.queryByTestId('menu-overlay')).not.toBeInTheDocument();
  });

  it('displays correct page title based on current path', () => {
    mockUsePathname.mockReturnValue('/pl/announcements');

    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toHaveTextContent('Planowane trasy');
    expect(pageTitle).toBeInTheDocument();
  });

  it('toggles menu state when hamburger icon is clicked multiple times', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Nav />
      </NextIntlClientProvider>,
    );

    const menuButton = screen.getByTestId('menu-button');
    const sideMenu = screen.getByTestId('side-menu');

    fireEvent.click(menuButton);
    expect(sideMenu).not.toHaveClass('hidden');
    expect(screen.getByTestId('menu-overlay')).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(sideMenu).toHaveClass('hidden');
    expect(screen.queryByTestId('menu-overlay')).not.toBeInTheDocument();
  });
});
