import * as React from 'react';
import Map from 'react-map-gl';

import { MapContainer } from '@/components/map-container';

import { MAPBOX_ACCESS_TOKEN } from '@/config/map';

const MAP_STYLE = "mapbox://styles/mapbox/dark-v9";
export default function MyMap() {
  return (
    <MapContainer
      className='w-0'
      control={
        <h3>Demo MapBox</h3>
      }
    >
      <Map
        initialViewState={{
          longitude: -95.36403,
          latitude: 29.756433,
          zoom: 19,
        }}
        maxZoom={24}
        doubleClickZoom={false}
        attributionControl={false}
        style={{ overflow: "hidden" }}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </MapContainer>
  );
}