import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Errand from '@/src/app/ui/posts/errand';
import { acceptErrand, deleteErrand } from '@/src/app/lib/actions';
import { ErrandProps, GoodsCategory } from '@/src/app/lib/definitions';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  posts: {
    sort: 'Sortuj',
    filter: 'Filtruj',
    openMap: 'Otwórz mapę tras',
    fromCity: 'z',
    from: 'od',
    to: 'do',
    plannedDepartureDate: 'planowana data rozpoczęcia trasy',
    plannedArrivalDate: 'planowana data dotarcia do celu',
    maximumWeight: 'maksymalna waga towarów',
    maximumSize: 'maksymalny wymiar towarów',
    maximumHeight: 'maksymalna wysokość towarów',
    deadline: 'Termin',
    departureDate: 'Data wyjazdu',
    arrivalDate: 'Data przyjazdu',
    cities: 'Miasta',
    ware: 'Towar',
    weight: 'Waga',
    width: 'Szerokość podstawy',
    length: 'Długość podstawy',
    height: 'Wysokość',
    wareCategory: 'Kategoria towaru',
    accept: 'Zatwierdź',
    ByNewest: 'Od najwcześniejszych',
    ByOldest: 'Od najpóźniejszych',
    ByWeightDesc: 'Od największej wagi towaru',
    ByWeightAsc: 'Od najmniejszej wagi towaru',
    BySizeAsc: 'Od najmniejszych wymiarów towaru',
    BySizeDesc: 'Od najwiekszych wymiarów towaru',
    ByHeightDesc: 'Od największej wysokości towaru',
    ByHeightAsc: 'Od najniższej wysokości towaru',
    roadDetails: 'Szczegóły trasy',
    desc: 'Opis',
    carInfo: 'Informacje o pojeździe',
    brand: 'marka',
    model: 'model',
    sizeInfo: 'Wymiary są podane w euro paletach',
    other: 'Inne',
    electronics: 'Elektronika',
    furniture: 'Meble',
    food: 'Żywność',
    textiles: 'Tekstylia',
    construction: 'Materiały budowlane',
    industrial: 'Przemysłowe',
    chemicals: 'Chemikalia',
    agriculture: 'Rolnicze',
    fuel: 'Paliwa',
    waste: 'Odpady',
    automotive: 'Motoryzacyjne',
    pharma: 'Farmaceutyczne',
    metal: 'Metal',
    paper: 'Papier',
    plastics: 'Tworzywa sztuczne',
    earliestAt: 'Najwcześniej wyjazd o',
    latestAt: 'Najpóźniej wyjazd o',
    wareName: 'Nazwa towaru',
    wareInfo: 'Informacje o towarze',
    goToChat: 'Przejdź do czatu',
    contact: 'Kontakt',
  },
};

jest.mock('@/src/app/lib/actions', () => ({
  acceptErrand: jest.fn(),
  deleteErrand: jest.fn(),
}));

const mockErrandProps: ErrandProps = {
  id: 'test-errand-1',
  title: 'Test Errand',
  from: {
    geography: { coordinates: ['52.2297', '21.0122'] as [string, string] },
    stateId: 0,
    countryId: 0,
    cityId: 0,
    countryIso2: 'PL',
    city: 'Warsaw',
  },
  to: {
    geography: { coordinates: ['50.0647', '19.945'] as [string, string] },
    stateId: 0,
    countryId: 0,
    cityId: 0,
    countryIso2: 'DE',
    city: 'Berlin',
  },
  earliestAt: new Date('2024-01-15'),
  latestAt: new Date('2024-01-20'),
  ware: {
    category: GoodsCategory.Electronics,
    name: 'Laptop',
    weight: 2.5,
    size: {
      x: 30,
      y: 20,
      height: 5,
    },
  },
};

describe('Errand Component', () => {
  it('renders errand details correctly', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Errand {...mockErrandProps} />
      </NextIntlClientProvider>,
    );

    // Check title
    expect(screen.getByText('Test Errand')).toBeInTheDocument();

    // Check locations
    expect(screen.getByText('PL, Warsaw')).toBeInTheDocument();
    expect(screen.getByText('DE, Berlin')).toBeInTheDocument();

    // Check dates
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();
    expect(screen.getByText('20.01.2024')).toBeInTheDocument();

    // Check ware details
    expect(screen.getByText('Elektronika')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('2.5 kg')).toBeInTheDocument();
    expect(screen.getByText('30x20')).toBeInTheDocument();
    expect(screen.getByText('5 cm')).toBeInTheDocument();
  });

  it('does not render moderator buttons by default', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Errand {...mockErrandProps} />
      </NextIntlClientProvider>,
    );

    expect(screen.queryByText('Zatwierdź')).not.toBeInTheDocument();
    expect(screen.queryByText('Usuń')).not.toBeInTheDocument();
  });

  it('renders moderator buttons when showModeratorButtons is true', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Errand {...mockErrandProps} showModeratorButtons={true} />
      </NextIntlClientProvider>,
    );

    const acceptButton = screen.getByText('Zatwierdź');
    const deleteButton = screen.getByText('Usuń');

    expect(acceptButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls acceptErrand when accept button is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Errand {...mockErrandProps} showModeratorButtons={true} />
      </NextIntlClientProvider>,
    );

    const acceptButton = screen.getByText('Zatwierdź');
    acceptButton.click();

    expect(acceptErrand).toHaveBeenCalledWith(mockErrandProps.id);
  });

  it('calls deleteErrand when delete button is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="pl">
        <Errand {...mockErrandProps} showModeratorButtons={true} />
      </NextIntlClientProvider>,
    );

    const deleteButton = screen.getByText('Usuń');
    deleteButton.click();

    expect(deleteErrand).toHaveBeenCalledWith(mockErrandProps.id);
  });
});
