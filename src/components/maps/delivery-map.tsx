'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Loader2, MapPinOff } from 'lucide-react';
import { geocodeAddress } from '@/app/actions/geocode-actions';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332
};

interface DeliveryMapProps {
  apiKey: string;
  address?: string;
  isDraggable?: boolean;
  initialCoordinates?: { lat: number; lng: number };
  onLocationChange?: (coords: { lat: number; lng: number }) => void;
}

export function DeliveryMap({ apiKey, address, isDraggable = false, initialCoordinates, onLocationChange }: DeliveryMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(initialCoordinates || null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    // Si se proporcionan coordenadas iniciales, darles prioridad.
    if (initialCoordinates) {
        setCoordinates(initialCoordinates);
        return;
    }

    // Si no hay coordenadas iniciales pero sí una dirección, geocodificar.
    if (!address) {
        setCoordinates(null); // Limpiar si no hay ni dirección ni coordenadas
        return;
    }

    const getCoordinates = async () => {
      setIsGeocoding(true);
      setGeocodingError(null);
      try {
        const result = await geocodeAddress({ address });
        setCoordinates(result);
        if (onLocationChange) {
            onLocationChange(result);
        }
      } catch (err: any) {
        setGeocodingError(err.message || 'No se pudo encontrar la dirección. Por favor, verifica que sea correcta.');
        console.error('Error al geocodificar la dirección:', err);
      } finally {
        setIsGeocoding(false);
      }
    };
    
    getCoordinates();

  }, [address, initialCoordinates, onLocationChange]);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (isDraggable && e.latLng && onLocationChange) {
      const newCoords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setCoordinates(newCoords);
      onLocationChange(newCoords);
    }
  }

  const mapCenter = coordinates || defaultCenter;

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-destructive/10 text-destructive p-4">
        <MapPinOff className="h-8 w-8 mb-2" />
        <p className="text-sm font-semibold">Error al cargar el script del mapa</p>
        <p className="text-xs text-center">Verifica la configuración de la API Key.</p>
      </div>
    );
  }

  if (!isLoaded || isGeocoding) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">{isGeocoding ? 'Buscando dirección...' : 'Cargando mapa...'}</p>
      </div>
    );
  }

  if (geocodingError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-destructive/10 text-destructive p-4">
            <MapPinOff className="h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">Error de Geocodificación</p>
            <p className="text-xs text-center">{geocodingError}</p>
        </div>
      )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={coordinates ? 16 : 10}
      options={{
          draggableCursor: isDraggable ? 'crosshair' : 'grab',
          clickableIcons: false
      }}
    >
      {coordinates && (
        <Marker 
          position={coordinates} 
          draggable={isDraggable}
          onDragEnd={handleMarkerDragEnd}
        />
      )}
    </GoogleMap>
  );
}
