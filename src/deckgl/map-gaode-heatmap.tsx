
import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { DeckGL } from '@deck.gl/react/typed';
import { LineLayer, ArcLayer, GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import * as turf from '@turf/turf'
import { Color } from 'deck.gl/typed';


const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 2,
    maxZoom: 30,
    pitch: 0,
    bearing: 0
};
const data = [
    { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }
];
const AIR_PORTS =
    'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';




const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];
const geoJson: any = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [116.40233, 39.785038],
                        [116.40293, 39.785109],
                        [116.402952, 39.785005],
                        [116.402346, 39.78494]
                    ]
                ]
            }
        }
    ]
}


async function getTiffData() {

    const cellSide = 20; // 20cm对应的经纬度大小，这个值会因地区和投影方式而略有差异
    const options = { units: "centimeters" };
    // const options = { units: "meters" };

    // 根据GeoJSON对象的边界创建栅格
    const bbox = turf.bbox(geoJson);

    // var grid = turf.squareGrid(bbox, cellSide, options);
    var grid = turf.pointGrid(bbox, cellSide, options as any);
    const result: any[] = [];
    grid.features.forEach((feature) => {
        result.push([feature.geometry.coordinates[0], feature.geometry.coordinates[1], 1])
    })

    console.log("async")

    return result;
}
export default function MyMap() {
    // const deckLayer = new Layer({
    //     render({ size, viewState }) {
    //         const [width, height] = size;
    //         const [longitude, latitude] = toLonLat(viewState.center);
    //         const zoom = viewState.zoom - 1;
    //         const bearing = (-viewState.rotation * 180) / Math.PI;
    //         const deckViewState = { bearing, longitude, latitude, zoom };
    //         deck.setProps({ width, height, viewState: deckViewState });
    //         deck.redraw();
    //     }
    // });
    const layers = [
        new LineLayer({ id: 'line-layer', data }),
        new GeoJsonLayer({
            id: 'airports',
            data: AIR_PORTS,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 2000,
            getPointRadius: (f: any) => 11 - f.properties.scalerank,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick: info =>
                // eslint-disable-next-line
                info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
        }),
        new ArcLayer({
            id: 'arcs',
            data: AIR_PORTS,
            dataTransform: (d: any) => d.features.filter((f: any) => f.properties.scalerank < 4),
            // Styles
            getSourcePosition: f => [-0.4531566, 51.4709959], // London
            getTargetPosition: f => f.geometry.coordinates,
            getSourceColor: [0, 128, 200],
            getTargetColor: [200, 0, 80],
            getWidth: 1
        }),
        new ScatterplotLayer({
            id: 'scatter-plot',
            data: getTiffData(),
            opacity: 0.5,
            radiusScale: 0.1,
            radiusMinPixels: 0.25,
            getPosition: d => [d[0], d[1], 0],
            getFillColor: (d: any) => (d[2] === 1 ? MALE_COLOR : FEMALE_COLOR) as Color,
            getRadius: 1,
            updateTriggers: {
                getFillColor: [MALE_COLOR, FEMALE_COLOR]
            }
        }),
        // new TileLayer({ source: new OSM() }),
        // deckLayer
    ];
    // const mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    const mapStyle = {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                'tiles': [
                    // wprd0{1-4} 
                    // scl=1&style=7 为矢量图（含路网和注记）
                    // scl=2&style=7 为矢量图（含路网但不含注记）
                    // scl=1&style=6 为影像底图（不含路网，不含注记）
                    // scl=2&style=6 为影像底图（不含路网、不含注记）
                    // scl=1&style=8 为影像路图（含路网，含注记）
                    // scl=2&style=8 为影像路网（含路网，不含注记）
                    "https://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=2&scl=1&style=8"
                ],
                "tileSize": 256
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "raster-tiles",
            "minzoom": 0,
            // "maxzoom": 18
        }]
    }
    return (
        <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers} >

            <Map reuseMaps={true} mapLib={maplibregl} mapStyle={mapStyle as any} />
        </DeckGL>
    );
}
