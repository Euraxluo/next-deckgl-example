import React from 'react';
import { DeckGL } from '@deck.gl/react/typed';
import { LineLayer } from '@deck.gl/layers/typed';
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0
};
const data = [
    { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];

export default function Map() {
    const layers = [
        new LineLayer({ id: 'line-layer', data })
    ];
    return (
        <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers} />
    );
}
