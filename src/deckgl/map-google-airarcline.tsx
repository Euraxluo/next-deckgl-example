/* global window */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArcLayer, GeoJsonLayer } from '@deck.gl/layers/typed';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMapsOverlay as DeckOverlay } from '@deck.gl/google-maps/typed';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GoogleMapsAPIKey;
export const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GoogleMapsMapId;
const renderMap = (status: any) => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return null;
};

declare var google: any;
function MyMap({ center, zoom }: { center: any, zoom: number }) {
    const ref = useRef();
    const [map, setMap] = useState(null);
    const overlay = useMemo(
        () =>
            new DeckOverlay({
                layers: [
                    new GeoJsonLayer({
                        id: 'airports',
                        data: AIR_PORTS,
                        // Styles
                        filled: true,
                        pointRadiusMinPixels: 2,
                        pointRadiusScale: 2000,
                        getPointRadius: (f:any) => 11 - f.properties.scalerank,
                        getFillColor: [200, 0, 80, 180],
                        // Interactive props
                        pickable: true,
                        autoHighlight: true,
                        onClick: info =>
                            info.object &&
                            // eslint-disable-next-line
                            alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
                    }),
                    // new ArcLayer({
                    //     id: 'arcs',
                    //     data: AIR_PORTS,
                    //     dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
                    //     // Styles
                    //     getSourcePosition: f => [-0.4531566, 51.4709959], // London
                    //     getTargetPosition: f => f.geometry.coordinates,
                    //     getSourceColor: [0, 128, 200],
                    //     getTargetColor: [200, 0, 80],
                    //     getWidth: 1
                    // })
                ]
            }),
        []
    );

    useEffect(() => {
        if (map) {
            (map as any).setCenter(center);
            (map as any).setZoom(zoom);
            overlay.setMap(map);
        }
    }, [map, center, zoom, overlay]);
    useEffect(() => {
        // Create map
        const mapInstance = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40, lng: -100 },
            zoom: 5,
            mapId: GOOGLE_MAP_ID // Only required for Vector maps
        });
        setMap(mapInstance);

    }, []);
    return (
        <>
            <div ref={ref as any} id="map" style={{ height: '100vh', width: '100wh' }} />
        </>
    );
}

export default function Root() {
    const center = { lat: 51.47, lng: 0.45 };
    const zoom = 5;

    return (
        <>
            <Wrapper apiKey={GOOGLE_MAPS_API_KEY as string} render={renderMap as any}>
                <MyMap center={center} zoom={zoom} />
            </Wrapper>
        </>
    );
}
