'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Road } from '../../lib/definitions';
import { Link } from '@/src/i18n/routing';

type MapProps = {
  zoom?: number;
  className?: string;
  roads?: Road[];
};

export default function Map({ zoom = 13, className, roads = [] }: MapProps) {
  const [routesPoints, setRoutesPoints] = useState<[number, number][][]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const t = useTranslations('map');

  useEffect(() => {
    const fetchRoutes = async () => {
      const newRoutes: [number, number][][] = [];

      for (const road of roads) {
        if (!road.from?.coordinates || !road.to?.coordinates) continue;

        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${road.from.coordinates[1]},${road.from.coordinates[0]};${road.to.coordinates[1]},${road.to.coordinates[0]}?overview=full&geometries=geojson`,
          );

          const data = await response.json();

          if (data.routes?.[0]?.geometry?.coordinates) {
            const points = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number],
            );
            newRoutes.push(points);
          }
        } catch (error) {
          console.error('Błąd podczas pobierania trasy:', error);
          newRoutes.push([]);
        }
      }

      setRoutesPoints(newRoutes);
    };

    fetchRoutes();
  }, [roads]);

  return (
    <MapContainer
      center={roads[0]?.from?.coordinates}
      zoom={zoom}
      scrollWheelZoom={true}
      className={`${className} z-10 h-screen w-full`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {roads.map(
        (road: Road, index) =>
          road.from?.coordinates && (
            <Marker key={index} position={road.from.coordinates}>
              <Popup>
                {t('startPoint')}
                <br />
                <Link href={`/announcements/${roads[index].postId}`}>Przejdź do ogłoszenia</Link>
              </Popup>
            </Marker>
          ),
      )}
      {roads.map(
        (road: Road, index) =>
          road.to?.coordinates && (
            <Marker key={index} position={road.to.coordinates}>
              <Popup>
                {t('endPoint')}
                <br />
                <Link href={`/announcements/${roads[index].postId}`}>Przejdź do ogłoszenia</Link>
              </Popup>
            </Marker>
          ),
      )}
      {routesPoints.map(
        (points, index) =>
          points &&
          points.length > 0 && (
            <div key={index}>
              <Polyline
                key={index}
                positions={points}
                color={roads[index].color}
                weight={3}
                opacity={0.5}
                eventHandlers={{
                  click: () => {
                    setSelectedRoute(index);
                  },
                }}
              />
              {selectedRoute === index && (
                <Popup
                  position={points[Math.floor(points.length / 2)]}
                  eventHandlers={{
                    remove: () => setSelectedRoute(null),
                  }}
                >
                  <div>
                    <Link href={`/announcements/${roads[index].postId}`}>
                      Przejdź do ogłoszenia
                    </Link>
                  </div>
                </Popup>
              )}
            </div>
          ),
      )}
    </MapContainer>
  );
}
