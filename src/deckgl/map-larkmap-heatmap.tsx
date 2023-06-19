import React, { useEffect, useState } from 'react';

import { Map } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { DeckGL } from '@deck.gl/react/typed';
import { ScreenGridLayer } from '@deck.gl/aggregation-layers/typed';
import { LineLayer, ArcLayer, GeoJsonLayer, ScatterplotLayer, GridCellLayer } from '@deck.gl/layers/typed';
import * as turf from '@turf/turf'
import { CustomControl, LarkMap, useScene } from '@antv/larkmap';
import { DrawCircle, DrawRect } from '@antv/l7-draw';



const INITIAL_VIEW_STATE = {
    longitude: 116.40233,
    latitude: 39.785038,
    zoom: 20,
    minZoom: 2,
    maxZoom: 21.84,
    pitch: 0,
    bearing: 0
};


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
    const cellSide = 10; // 20cm对应的经纬度大小，这个值会因地区和投影方式而略有差异
    const options = { units: "centimeters" };
    // const options = { units: "meters" };
    // 根据GeoJSON对象的边界创建栅格
    const bbox = turf.bbox(geoJson);
    var grid = turf.pointGrid(bbox, cellSide, options as any);
    const result: any = [];
    grid.features.forEach((feature) => {
        result.push([feature.geometry.coordinates[0], feature.geometry.coordinates[1], 2])
    })
    return result;
}


function CustomDraw() {
    const [circleDrawer, setCircleDrawer] = useState<DrawCircle | null>(null);
    const [rectDrawer, setRectDrawer] = useState<DrawRect | null>(null);
    const [zoom, setZoom] = useState(20);

    const scene = useScene();
    useEffect(() => {
        const drawerRect = new DrawRect(scene, {
            distanceOptions: {},
            areaOptions: {},
        });
        setRectDrawer(drawerRect);
        const drawerCircle = new DrawCircle(scene, {});
        setCircleDrawer(drawerCircle);

    }, []);
    return (
        <CustomControl className="float-right">
            <div style={{ padding: 8 }}>
                circleDrawer
                <button onClick={() => circleDrawer?.enable()}>启用</button>
                <button onClick={() => circleDrawer?.disable()}>禁用</button>
                <button onClick={() => circleDrawer?.clear()}>清空</button>
            </div>
            <div style={{ padding: 8 }}>
                rectDrawer
                <button onClick={() => rectDrawer?.enable()}>启用</button>
                <button onClick={() => rectDrawer?.disable()}>禁用</button>
                <button onClick={() => rectDrawer?.clear()}>清空</button>
            </div>

        </CustomControl>
    );
}

export default function MyMap() {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const onLarkMapViewStateChange = ({ viewState }: any) => {
        console.log("onLarkMapViewStateChange");
        console.log(viewState);
        setViewState(viewState);
    };
    const onDeckGLViewStateChange = ({ viewState }: any) => {
        console.log("onDeckGLViewStateChange");
        console.log(viewState);
        setViewState(viewState);
    };

    const [zoom, setZoom] = useState(20);
    const XMAP_STYLE = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json'; // eslint-disable-line

    const layers = [
        new ScreenGridLayer({
            id: 'scatter-plot',
            data: getTiffData(),
            opacity: 0.1,
            getPosition: d => [d[0], d[1]],
            getWeight: d => d[2],
            cellSizePixels: 10,
            cellMarginPixels: 1,
            colorRange: [
                [255, 255, 178, 25],
                [254, 217, 118, 85],
                [254, 178, 76, 127],
                [253, 141, 60, 170],
                [240, 59, 32, 212],
                [189, 0, 38, 255],
            ],
            gpuAggregation: true,
            aggregation: 'MAX',
            // visible: zoom > 20,
        }),
    ];
    const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

    const mapStyle = {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                'tiles': [
                    "http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7"
                ],
                "tileSize": 256
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "raster-tiles",
            "minzoom": 2,
            // "maxzoom": 24
        }]
    }
    return (

        <LarkMap
            className="h-9/10"
            mapOptions={{
                pitch: viewState.pitch,
                zoom: viewState.zoom,
                center: [viewState.longitude, viewState.latitude],
                minZoom: viewState.minZoom,
                maxZoom: viewState.maxZoom,
                bearing: viewState.bearing,
                interactive: false,
            }}
            onZoomChange={(zoom) => { console.log(zoom); }}
        >
            <CustomDraw />
            <DeckGL
                initialViewState={viewState}
                onViewStateChange={onDeckGLViewStateChange}
                controller={true}
                layers={layers}
            />
        </LarkMap>
    );

}
