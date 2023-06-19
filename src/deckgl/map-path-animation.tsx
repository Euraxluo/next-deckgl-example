import { SliderInput } from '@/components/SliderInput';
import getBearing from '@turf/rhumb-bearing';
import getDistance from '@turf/rhumb-distance';
import { DeckGL, PathLayer, ScenegraphLayer } from 'deck.gl/typed';
import maplibregl from 'maplibre-gl';
import { useState } from 'react';
import { Map } from 'react-map-gl';




function getTurnAngle(startHeading: number, endHeading: number) {
    let turnAngle = endHeading - startHeading;
    if (turnAngle < -180) turnAngle += 360;
    if (turnAngle > 180) turnAngle -= 360;
    return turnAngle;
}

interface Keyframe {
    point: number[];
    heading?: number;
    time: number;
}

interface TripBuilderOptions {
    waypoints: number[][];
    speed?: number;
    turnSpeed?: number;
    loop?: boolean;
}

class TripBuilder {
    private keyframes: Keyframe[];
    private speed: number;
    private turnSpeed: number;
    private loop: boolean;
    private totalTime: number;

    constructor({
        waypoints,
        speed = 10, // meters
        turnSpeed = 45, // degrees
        loop = false
    }: TripBuilderOptions) {
        this.keyframes = [];
        this.speed = speed;
        this.turnSpeed = turnSpeed;
        this.loop = loop;
        this.totalTime = 0;

        for (const p of waypoints) {
            this._moveTo(p);
        }
        if (loop && waypoints.length > 2) {
            this._moveTo(waypoints[0]);
            this._turnTo(this.keyframes[0].heading!);
        }
    }

    private _moveTo(point: number[]): void {
        if (this.keyframes.length === 0) {
            this.keyframes.push({
                point,
                time: 0
            });
            return;
        }

        const prevKeyframe = this.keyframes[this.keyframes.length - 1];
        const distance = getDistance(prevKeyframe.point, point, { units: 'kilometers' }) * 1000;
        const heading = getBearing(prevKeyframe.point, point);

        if (distance < 0.1) {
            return;
        }
        if (prevKeyframe.heading === undefined) {
            prevKeyframe.heading = heading;
        } else {
            this._turnTo(heading);
        }

        const duration = distance / this.speed;

        this.keyframes.push({
            point,
            heading,
            time: (this.totalTime += duration)
        });
    }

    private _turnTo(heading: number): void {
        const prevKeyframe = this.keyframes[this.keyframes.length - 1];
        const angle = Math.abs(getTurnAngle(prevKeyframe.heading!, heading));

        if (angle > 0) {
            const duration = angle / this.turnSpeed;
            this.keyframes.push({
                point: prevKeyframe.point,
                heading,
                time: (this.totalTime += duration)
            });
        }
    }

    public getFrame(timestamp: number): { point: number[]; heading: number } {
        timestamp = this.loop ? timestamp % this.totalTime : Math.min(timestamp, this.totalTime);
        const i = this.keyframes.findIndex((s) => s.time >= timestamp);
        const startState = this.keyframes[i - 1];
        const endState = this.keyframes[i];
        const r = (timestamp - startState.time) / (endState.time - startState.time);

        return {
            point: [
                startState.point[0] * (1 - r) + endState.point[0] * r,
                startState.point[1] * (1 - r) + endState.point[1] * r
            ],
            heading: startState.heading! + getTurnAngle(startState.heading!, endState.heading!) * r
        };
    }
}

const INITIAL_VIEW_STATE = {
    longitude: -95.36403,
    latitude: 29.756433,
    zoom: 19,
    maxZoom: 30,
    pitch: 0,
    bearing: 0,
    heading: 0,
    streetViewControl: false
};


const MODEL_URL =
    'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/google-3d/truck.gltf'; // eslint-disable-line


var timestamp = 0;
function formatTimeLabel(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds / 60) % 60;
    const s = seconds % 60;
    return [h, m, s].map(x => x.toString().padStart(2, '0')).join(':');
}

export default function PathMap() {
    const trips = [
        [
            [
                -95.364041,
                29.756421
            ],
            [
                -95.361471,
                29.754867
            ],
            [
                -95.360633,
                29.754379
            ],
            [
                -95.361213,
                29.753626
            ],
            [
                -95.362074,
                29.75412
            ],
            [
                -95.363759,
                29.755176
            ],
            [
                -95.364355,
                29.754418
            ],
            [
                -95.366974,
                29.75601
            ],
            [
                -95.364622,
                29.758971
            ],
            [
                -95.363733,
                29.758421
            ],
            [
                -95.362881,
                29.757926
            ]
        ],
        [
            [
                -95.362849,
                29.754704
            ],
            [
                -95.361736,
                29.756131
            ],
            [
                -95.360893,
                29.755613
            ],
            [
                -95.361472,
                29.754875
            ],
            [
                -95.362082,
                29.754121
            ],
            [
                -95.362646,
                29.753394
            ],
            [
                -95.363498,
                29.753894
            ],
            [
                -95.362908,
                29.754629
            ]
        ],
        [
            [
                -95.362674,
                29.75493
            ],
            [
                -95.361736,
                29.756131
            ],
            [
                -95.360893,
                29.755613
            ],
            [
                -95.361472,
                29.754875
            ],
            [
                -95.362082,
                29.754121
            ],
            [
                -95.362646,
                29.753394
            ],
            [
                -95.363498,
                29.753894
            ]
        ],
        [
            [
                -95.363177,
                29.755911
            ],
            [
                -95.362588,
                29.756656
            ],
            [
                -95.364287,
                29.75766
            ],
            [
                -95.364862,
                29.756939
            ],
            [
                -95.365483,
                29.756174
            ],
            [
                -95.36464,
                29.755656
            ],
            [
                -95.363757,
                29.755162
            ]
        ],
        [
            [
                -95.362588,
                29.756656
            ],
            [
                -95.364287,
                29.75766
            ],
            [
                -95.364862,
                29.756939
            ],
            [
                -95.365483,
                29.756174
            ],
            [
                -95.36464,
                29.755656
            ],
            [
                -95.363757,
                29.755162
            ],
            [
                -95.363177,
                29.755911
            ]
        ],
        [
            [
                -95.36666,
                29.754684
            ],
            [
                -95.366058,
                29.755443
            ],
            [
                -95.366172,
                29.755509
            ],
            [
                -95.366763,
                29.754746
            ]
        ],
        [
            [
                -95.365637,
                29.756273
            ],
            [
                -95.367251,
                29.757255
            ],
            [
                -95.367834,
                29.756522
            ],
            [
                -95.367405,
                29.756257
            ],
            [
                -95.367834,
                29.756522
            ],
            [
                -95.367251,
                29.757255
            ]
        ]
    ]
    const [viewport, setViewPort] = useState(INITIAL_VIEW_STATE);
    const [currentTime, setCurrentTime] = useState(1);

    const tripList = trips.map(waypoints => new TripBuilder({ waypoints, loop: true }));

    timestamp += 0.02;
    const frame = tripList.map(trip => trip.getFrame(timestamp));
    const layers = [
        new PathLayer({
            id: 'trip-lines',
            data: tripList,
            getPath: d => d.keyframes.map((f: any) => f.point),
            getColor: _ => [128 * Math.random(), 255 * Math.random(), 255],
            jointRounded: true,
            opacity: 0.5,
            getWidth: 0.5
        }),
        new ScenegraphLayer({
            id: 'truck',
            data: frame,
            scenegraph: MODEL_URL,
            sizeScale: 2,
            getPosition: d => d.point,
            getTranslation: [0, 0, 1],
            getOrientation: d => [0, 180 - d.heading, 90],
            _lighting: 'pbr'
        })
    ];
    const mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    return (
        <>
            <SliderInput
                className="fixed p-4 text-sm bg-white"
                min={0}
                max={86400}
                value={currentTime}
                onChange={setCurrentTime}
                title={'title'}
                onBlur={() => { console.log('onblur'); }} />
            <DeckGL
                style={{ position: "relative" }}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers} >
                <Map
                    mapLib={maplibregl}
                    mapStyle={mapStyle}
                />
            </DeckGL>
        </>
    );
}

