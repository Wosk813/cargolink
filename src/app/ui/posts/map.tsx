import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { GeoPoint } from '../../lib/definitions';

type MapProps = {
  zoom?: number;
  className?: string;
  from: GeoPoint | undefined;
  to: GeoPoint | undefined;
};

export default function Map({ zoom = 13, className, from, to }: MapProps) {
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

  useEffect(() => {
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!from?.coordinates || !to?.coordinates) return;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from.coordinates[1]},${from.coordinates[0]};${to.coordinates[1]},${to.coordinates[0]}?overview=full&geometries=geojson`,
        );

        const data = await response.json();

        if (data.routes?.[0]?.geometry?.coordinates) {
          const points = data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number],
          );
          setRoutePoints(points);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania trasy:', error);
      }
    };

    fetchRoute();
  }, [from, to]);

  return (
    <MapContainer
      center={from.coordinates}
      zoom={zoom}
      scrollWheelZoom={true}
      className={`${className} h-screen w-full`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {from.coordinates && (
        <Marker position={from.coordinates}>
          <Popup>Punkt początkowy</Popup>
        </Marker>
      )}

      {to.coordinates && (
        <Marker position={to.coordinates}>
          <Popup>Punkt końcowy</Popup>
        </Marker>
      )}

      {routePoints.length > 0 && (
        <Polyline positions={routePoints} color="blue" weight={3} opacity={0.5} />
      )}
    </MapContainer>
  );
}
