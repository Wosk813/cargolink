import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllRoadsMap from '@/src/app/ui/posts/all-roads-map';
import { AnnouncementProps } from '@/src/app/lib/definitions';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn: () => Promise<React.ComponentType>) => {
    return function MockMap(props: any) {
      return (
        <div data-testid="mock-map" {...props}>
          Mocked Map
        </div>
      );
    };
  },
}));

global.fetch = jest.fn();

describe('AllRoadsMap Component', () => {
  const mockAnnouncements: AnnouncementProps[] = [
    {
      title: 'Test announcement 1',
      departureDate: new Date(),
      arrivalDate: new Date(),
      carProps: { maxWeight: 1000, maxSize: { x: 5, y: 5, height: 200 } },
      id: '1',
      from: {
        geography: { coordinates: ['52.2297', '21.0122'] },
        stateId: 0,
        countryId: 0,
        cityId: 0,
      },
      to: {
        geography: { coordinates: ['50.0647', '19.945'] },
        stateId: 0,
        countryId: 0,
        cityId: 0,
      },
      roadColor: '#FF0000',
    },
    {
      title: 'Test announcement 2',
      departureDate: new Date(),
      arrivalDate: new Date(),
      carProps: { maxWeight: 1000, maxSize: { x: 5, y: 5, height: 200 } },
      id: '1',
      from: {
        geography: { coordinates: ['52.2297', '21.0122'] },
        stateId: 0,
        countryId: 0,
        cityId: 0,
      },
      to: {
        geography: { coordinates: ['50.0647', '19.945'] as [string, string] },
        stateId: 0,
        countryId: 0,
        cityId: 0,
      },
      roadColor: '#FF0000',
    },
  ];

  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('fetches and transforms roads data correctly', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockAnnouncements),
    } as any);

    render(<AllRoadsMap postType="announcements" />);

    await waitFor(() => {
      const mockMap = screen.getByTestId('mock-map');
      expect(mockMap).toBeInTheDocument();
      expect(fetch).toHaveBeenCalledWith('/pl/announcements/get?sort=byNewest&category=all');
    });
  });

  it('handles fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('Fetch failed'));

    render(<AllRoadsMap postType="announcements" />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching announcements:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('transforms announcement data to road format correctly', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockAnnouncements),
    } as any);

    render(<AllRoadsMap postType="announcements" />);

    await waitFor(() => {
      const mockMap = screen.getByTestId('mock-map');
      let roads = mockMap.getAttribute('roads');

      expect(roads).toBeDefined();
    });
  });

  it('passes correct props to Map component', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockAnnouncements),
    } as any);

    render(<AllRoadsMap postType="announcements" />);

    await waitFor(() => {
      const mockMap = screen.getByTestId('mock-map');
      expect(mockMap).toHaveAttribute('zoom', '5');
      expect(mockMap).toHaveClass('!h-96');
      expect(mockMap).toHaveClass('rounded-md');
    });
  });
});
