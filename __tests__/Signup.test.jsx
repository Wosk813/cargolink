import '@testing-library/jest-dom';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../src/app/ui/auth/signup-form';
import { act } from 'react';

jest.mock('@/src/app/actions/auth', () => ({
  signup: jest.fn(),
  validateFirstStep: jest.fn(),
  handleSubmit: jest.fn(),
}));

const messages = {
  signup: {
    joinUs: 'Dołącz do nas',
    firstname: 'Imię',
    lastname: 'Nazwisko',
    repeatEmail: 'Powtórz E-mail',
    password: 'Hasło',
    repeatPassword: 'Powtórz hasło',
    next: 'Dalej',
    back: 'Wróć',
    atLeastLength: 'powinno mieć co najmniej {min} długości',
    enterValidEmail: 'Wprowadź poprawny E-mail',
    atLeastLetter: 'Hasło powinno mieć co najmniej jedną literę',
    atLeastNumber: 'Hasło powinno mieć co najmniej jedną liczbę',
    emailDontMatch: "Wprowadzone E-mail'e nie są identyczne",
    passwordDontMatch: 'Wprowadzone hasła nie są identyczne',
    nipIsNotValid: 'NIP powinien mieć {length} znaków',
    companyName: 'Przedsiębiorstwo',
    selectCountry: 'Wybierz kraj',
    postalCodeIsNotValid: 'Kod pocztowy nie jest prawidłowy, powinien mieć {length} znaków',
    city: 'Miasto',
    street: 'Ulica',
    submit: 'Zarejestruj się',
    selectAccountType: 'Wybierz typ konta',
    acceptStatute: 'Zaaktepuj regulamin',
    whatLanguagesDoYouKnow: 'Jakie języki znasz?',
    whatLanguagesDoYouKnowDesc:
      'Zaznacz języki, którymi się posługujesz. Będą one wyświetlane na Twoim profilu. Ułatwi to komunikacje z innymi użytkownikami.',
    asCompany: 'Zamierzasz korzystać z aplikacji jako przedsiębiorstwo czy osoba fizyczna?',
    asCompanyDesc:
      'Dane wpisane w tych polach będą używane, aby generowannie umów wymagało od Ciebie jak najmniejszej ilości wpisywanych informacji.',
    accountType: 'W jaki sposób zamierzasz korzystać z serwisu',
    asCarrier: 'Chcę świadczyć usługi transportowe',
    asCarrierDesc:
      'Jako przewoźnik w naszej aplikacji, będziesz mógł łatwo i szybko znaleźć zlecenia transportowe, które pasują do Twoich tras i harmonogramu. Dzięki platformie, zyskasz dostęp do szerokiej bazy zleceń, co pozwoli Ci maksymalnie wykorzystać swoje zasoby, unikając pustych przebiegów. Dodatkowo, będziesz mógł budować swoją reputację poprzez oceny i komentarze od zleceniodawców, co przyczyni się do zwiększenia liczby zleceń i długotrwałych relacji biznesowych.',
    asPrincipal: 'Chcę zlecać usługi transportowe',
    asPrincipalDesc:
      'Jako zleceniodawca w naszej aplikacji, zyskasz możliwość szybkiego i wygodnego zlecania transportu swoich towarów. Nasza platforma pomoże Ci znaleźć odpowiednich przewoźników, którzy spełnią Twoje wymagania i zapewnią bezpieczny oraz terminowy transport.',
    company: 'Przedsiębiorstwo',
    companyFullName: 'Pełna nazwa przedsiębiorstwa',
    country: 'Kraj',
    postalCode: 'Kod pocztowy',
    asPhisicalPerson: 'Osoba fizyczna',
    chooseLanguages: 'Wybierz języki jakie znasz',
    acceptedStatute: 'Przeczytałem/am regulamin i go akceptuje',
    emailIsUsed: 'Ten e-mail jest już przez kogoś używany',
  },
};

describe('Signup', () => {
  it('button is next', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <SignupForm />
      </NextIntlClientProvider>,
    );

    const button = screen.getByTestId('button-next');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Dalej');
  });
  it('show input problems', async () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <SignupForm />
      </NextIntlClientProvider>,
    );

    const firstnameInput = screen.getByTestId('firstname-input');
    await act(async () => {
      fireEvent.change(firstnameInput, {
        target: { value: 'a' },
      });
      fireEvent.click(screen.getByText('Dalej'));
    });

    await waitFor(() => {
      const errorMessage = screen.getByText('Imię powinno mieć co najmniej 2 długości');
      expect(errorMessage).toBeInTheDocument();
    });
  });
  it('back button is hidden', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <SignupForm />
      </NextIntlClientProvider>,
    );

    const backButton = screen.queryByText('Wróć');
    expect(backButton).toBeNull();
  });
});
