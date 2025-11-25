'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Loader2, MapPinOff } from 'lucide-react';
import { geocodeAddress } from '@/app/actions/geocode-actions';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 19.4326,
  lng: -99.1332
};

interface DeliveryMapProps {
  apiKey: string;
  address: string;
  isDraggable?: boolean;
  initialCoordinates?: { lat: number; lng: number };
  onLocationChange?: (coords: { lat: number; lng: number }) => void;
}

export function DeliveryMap({ apiKey, address, isDraggable = false, initialCoordinates, onLocationChange }: DeliveryMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(initialCoordinates || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
        setError('La clave de API de Google Maps no está configurada.');
        setLoading(false);
        return;
    }

    if (initialCoordinates) {
        setCoordinates(initialCoordinates);
        setLoading(false);
        return;
    }

    const getCoordinates = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await geocodeAddress({ address });
        setCoordinates(result);
        if (onLocationChange) {
            onLocationChange(result);
        }
      } catch (err: any) {
        setError(err.message || 'No se pudo encontrar la dirección. Por favor, verifica que sea correcta.');
        console.error('Error al geocodificar la dirección:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo geocodifica si hay una dirección y no hay coordenadas iniciales.
    if (address && !initialCoordinates) {
        getCoordinates();
    } else {
        setLoading(false);
    }

  }, [address, apiKey, initialCoordinates, onLocationChange]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isDraggable && e.latLng) {
      const newCoords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setCoordinates(newCoords);
      if (onLocationChange) {
        onLocationChange(newCoords);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  if (error || !apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-destructive/10 text-destructive p-4">
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
        onClick={handleMapClick}
        options={{
            draggableCursor: isDraggable ? 'pointer' : 'grab',
        }}
      >
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    </LoadScript>
  );
}
