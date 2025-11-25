'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Loader2, MapPinOff } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '0.5rem',
};

const center = {
  lat: 19.4326,
  lng: -99.1332
};

interface DeliveryMapProps {
  address: string;
}

export function DeliveryMap({ address }: DeliveryMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
        setError('La clave de API de Google Maps no está configurada.');
        setLoading(false);
        return;
    }

    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.status === 'OK') {
          setCoordinates(data.results[0].geometry.location);
        } else {
          setError('No se pudo encontrar la dirección. Por favor, verifica que sea correcta.');
          console.warn('Geocoding API response:', data);
        }
      } catch (err) {
        setError('Error al contactar el servicio de mapas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address, apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  if (error || !apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] bg-destructive/10 text-destructive rounded-lg p-4">
        <MapPinOff className="h-8 w-8 mb-2" />
        <p className="text-sm font-semibold">Error al mostrar el mapa</p>
        <p className="text-xs text-center">{error || 'La clave de API no está configurada.'}</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates || center}
        zoom={coordinates ? 16 : 10}
      >
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    </LoadScript>
  );
}
