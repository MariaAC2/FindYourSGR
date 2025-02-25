import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    OnDestroy
} from "@angular/core";

import esri = __esri; // Esri TypeScript Types

import Config from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import Polygon from '@arcgis/core/geometry/Polygon';
import * as locator from '@arcgis/core/rest/Locator';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import * as route from "@arcgis/core/rest/route.js";

import Search from "@arcgis/core/widgets/Search";

import { Subscription } from "rxjs";
import { FirebaseService, IDatabaseItem } from "src/app/services/firebase";
import { SuperheroFactoryService } from "src/app/services/superhero-factory";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit, OnDestroy {
    @Output() mapLoadedEvent = new EventEmitter<boolean>();

    @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

    map: esri.Map;
    view: esri.MapView;
    graphicsLayer: esri.GraphicsLayer;
    graphicsLayerStaticPoints: esri.GraphicsLayer;
    graphicsLayerRoutes: esri.GraphicsLayer;
    trailheadsLayer: esri.FeatureLayer;

    zoom = 10;
    center: Array<number> = [-118.73682450024377, 34.07817583063242];
    basemap = "streets-vector";
    loaded = false;
    directionsElement: any;
    userCenterGraphic: Graphic | null = null;

    // firebase sync
    isConnected: boolean = false;
    subscriptionList: Subscription | null = null;
    subscriptionObj: Subscription | null = null;

    listItems: IDatabaseItem[] = [];

    constructor(
        private fbs: FirebaseService,
        private sfs: SuperheroFactoryService
    ) {

    }

    ngOnInit() {
        try {
            this.initializeMap().then(() => {
                this.loaded = this.view.ready;
                this.mapLoadedEvent.emit(true);
                this.addSampleGraphics();

                this.connectFirebase();
                this.displayFirebaseDataOnMap();

                this.startTrackingUserPosition();
            });
        } catch (error) {
            console.error("Error loading the map: ", error);
            alert("Error loading the map");
        }
    }

    connectFirebase() {
        if (this.isConnected) {
            return;
        }
        this.isConnected = true;
        this.fbs.connectToDatabase();
        this.subscriptionList = this.fbs.getChangeFeedList().subscribe((items: IDatabaseItem[]) => {
            console.log("list updated: ", items);
            this.listItems = items;
        });
        this.subscriptionObj = this.fbs.getChangeFeedObject().subscribe((stat: IDatabaseItem) => {
            console.log("object updated: ", stat);
        });
    }

    addListItem() {
        let newItemValue: string = Math.floor(Math.random() * 100).toString();
        newItemValue = this.sfs.getName();
        this.fbs.addListObject(newItemValue);
    }

    removeItems() {
        this.fbs.removeListItems();
    }

    disconnectFirebase() {
        if (this.subscriptionList != null) {
            this.subscriptionList.unsubscribe();
        }
        if (this.subscriptionObj != null) {
            this.subscriptionObj.unsubscribe();
        }
    }

    addPointToFirebase(lat: number, lng: number) {
        this.fbs.addListObject({ latitude: lat, longitude: lng });
    }

    startTrackingUserPosition() {
        setInterval(() => {
            const center = this.view.center;
            this.fbs.updateUserPosition({ latitude: center.latitude, longitude: center.longitude });
        }, 1000);
    }

    displayFirebaseDataOnMap() {
        this.subscriptionList = this.fbs.getMapPoints().subscribe((items: any[]) => {

            items.forEach(item => {
                if (item.latitude != null && item.longitude != null) {
                    const point = new Point({
                        longitude: item.longitude,
                        latitude: item.latitude
                    });

                    const pointSymbol = {
                        type: "simple-marker",
                        color: [97, 17, 255],
                        outline: { color: [255, 255, 255], width: 1 }
                    };

                    const pointGraphic = new Graphic({
                        geometry: point,
                        symbol: pointSymbol
                    });
                    this.graphicsLayerStaticPoints.add(pointGraphic);
                }
            });
            console.log("Punctele statice din Firebase afișate pe hartă:", items);
        });

        this.subscriptionObj = this.fbs.getUserPosition().subscribe((position: any) => {
            if (position && position.latitude != null && position.longitude != null) {
                const userPoint = new Point({
                    longitude: position.longitude,
                    latitude: position.latitude
                });

                const userSymbol = {
                    type: "simple-marker",
                    color: [0, 120, 255],
                    outline: { color: [255, 255, 255], width: 1 }
                };

                const userGraphic = new Graphic({
                    geometry: userPoint,
                    symbol: userSymbol
                });

                if (this.userCenterGraphic) {
                    this.graphicsLayerStaticPoints.remove(this.userCenterGraphic);
                }

                this.graphicsLayerStaticPoints.add(userGraphic);
                this.userCenterGraphic = userGraphic;
                console.log("Coordonatele utilizatorului afișate pe hartă:", position);
            }
        });
    }
    
    async initializeMap() {
        try {
            Config.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJP5XL48yDX-cAW0ysqARN5fvEJgMDmJHvPA9NIk4Wevr99IpgJOxKkfCQcvGVEVfL4w17yZh86-Eh4CiggjpmBw27sLZJOl7TAeROESp2edX4dbQf5PoDJMZc1JXzuNzsbgOX8KIteaFkdk5pLOqlStd65eVRjrzapERuOLGndjRoyudrrziRpdGGPsqdFdXGXIKZUWpcx68DxX-hTOJ4E.AT1_rrHRS8gn";

            const mapProperties: esri.WebMapProperties = {
                basemap: this.basemap
            };
            this.map = new WebMap(mapProperties);

            this.addFeatureLayers();
            this.addGraphicsLayer();

            const mapViewProperties = {
                container: this.mapViewEl.nativeElement,
                center: this.center,
                zoom: this.zoom,
                map: this.map
            };
            this.view = new MapView(mapViewProperties);

            this.view.on("click", (event) => {
                const point = this.view.toMap({ x: event.x, y: event.y });
                if (point) {
                    this.addPointToFirebase(point.latitude, point.longitude);
                }
            });

            await this.view.when();
            console.log("ArcGIS map loaded");
            this.addRouting();
            this.addSearchWidget();
            return this.view;
        } catch (error) {
            console.error("Error loading the map: ", error);
            alert("Error loading the map");
        }
    }


    addSampleGraphics() {
        // Exemplu de punct grafic în Los Angeles
        const point = new Point({
            longitude: -118.80657463861,
            latitude: 34.0005930608889
        });
        const pointSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: { color: [255, 255, 255], width: 1 } // White outline
        };
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: pointSymbol
        });
        this.graphicsLayer.add(pointGraphic);

        // Exemplu de linie grafică între două puncte din zona Los Angeles
        const polyline = new Polyline({
            paths: [
                [[-118.821527826096, 34.0139576938577],
                [-118.814893761649, 34.0080602407843],
                [-118.808878330345, 34.0016642996246]]
            ]
        });
        const lineSymbol = {
            type: "simple-line",
            color: [226, 119, 40],
            width: 2
        };
        const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: lineSymbol
        });
        this.graphicsLayer.add(polylineGraphic);

        // Exemplu de poligon grafic mai mare în zona Los Angeles
        const polygon = new Polygon({
            rings: [
                [[-118.818984489994, 34.0137559967283], //Longitude, latitude
                [-118.806796597377, 34.0215816298725], //Longitude, latitude
                [-118.791432890735, 34.0163883241613], //Longitude, latitude
                [-118.79596686535, 34.008564864635],   //Longitude, latitude
                [-118.808558110679, 34.0035027131376]
                ]
            ]
        });
        const polygonSymbol = {
            type: "simple-fill",
            color: [227, 139, 79, 0.4], // Orange semi-transparent
            outline: {
                color: [255, 255, 255],
                width: 1
            }
        };
        const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: polygonSymbol
        });
        this.graphicsLayer.add(polygonGraphic);

        console.log("Sample graphics added to map");
    }


    addSearchWidget() {
        const searchWidget = new Search({
            view: this.view
        });
        this.view.ui.add(searchWidget, "top-right");
    }

    addFeatureLayers() {
        this.trailheadsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
            outFields: ['*']
        });
        this.map.add(this.trailheadsLayer);

        const trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
        });
        this.map.add(trailsLayer, 0);

        const parksLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
        });
        this.map.add(parksLayer, 0);

        console.log("Feature layers added");
    }

    addGraphicsLayer() {
        this.graphicsLayer = new GraphicsLayer();
        this.map.add(this.graphicsLayer);
        this.graphicsLayerRoutes = new GraphicsLayer();
        this.map.add(this.graphicsLayerRoutes);
        this.graphicsLayerStaticPoints = new GraphicsLayer();
        this.map.add(this.graphicsLayerStaticPoints);
        this.graphicsLayerStaticPoints = new GraphicsLayer();
        this.map.add(this.graphicsLayerStaticPoints);
    }

    addRouting() {
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
        this.view.on("click", (event) => {
            this.view.hitTest(event).then((elem: esri.HitTestResult) => {
                if (elem && elem.results && elem.results.length > 0) {
                    let point: esri.Point = elem.results.find(e => e.layer === this.trailheadsLayer)?.mapPoint;
                    if (point) {
                        console.log("get selected point: ", elem, point);
                        if (this.graphicsLayerStaticPoints.graphics.length === 0) {
                            this.addPoint(point.latitude, point.longitude);
                        } else if (this.graphicsLayerStaticPoints.graphics.length === 1) {
                            this.addPoint(point.latitude, point.longitude);
                            this.calculateRoute(routeUrl);
                        } else {
                            this.removePoints();
                        }
                    }
                }
            });
        });
    }

    addPoint(lat: number, lng: number) {
        let point = new Point({
            longitude: lng,
            latitude: lat
        });

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
        };

        let pointGraphic: esri.Graphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
        });

        this.graphicsLayerStaticPoints.add(pointGraphic);
    }

    removePoints() {
        this.graphicsLayerStaticPoints.removeAll();
    }

    removeRoutes() {
        this.graphicsLayerRoutes.removeAll();
    }

    async calculateRoute(routeUrl: string) {
        const routeParams = new RouteParameters({
            stops: new FeatureSet({
                features: this.graphicsLayerStaticPoints.graphics.toArray()
            }),
            returnDirections: true
        });

        try {
            const data = await route.solve(routeUrl, routeParams);
            this.displayRoute(data);
        } catch (error) {
            console.error("Error calculating route: ", error);
            alert("Error calculating route");
        }
    }

    displayRoute(data: any) {
        for (const result of data.routeResults) {
            result.route.symbol = {
                type: "simple-line",
                color: [5, 150, 255],
                width: 3
            };
            this.graphicsLayerRoutes.graphics.add(result.route);
        }
        if (data.routeResults.length > 0) {
            this.showDirections(data.routeResults[0].directions.features);
        } else {
            alert("No directions found");
        }
    }

    clearRouter() {
        if (this.view) {
            // Remove all graphics related to routes
            this.removeRoutes();
            this.removePoints();
            console.log("Route cleared");
            this.view.ui.remove(this.directionsElement);
            this.view.ui.empty("top-right");
            console.log("Directions cleared");
        }
    }

    showDirections(features: any[]) {
        this.directionsElement = document.createElement("ol");
        this.directionsElement.classList.add("esri-widget", "esri-widget--panel", "esri-directions__scroller");
        this.directionsElement.style.marginTop = "0";
        this.directionsElement.style.padding = "15px 15px 15px 30px";

        features.forEach((result, i) => {
            const direction = document.createElement("li");
            direction.innerHTML = `${result.attributes.text} (${result.attributes.length} miles)`;
            this.directionsElement.appendChild(direction);
        });

        this.view.ui.empty("top-right");
        this.view.ui.add(this.directionsElement, "top-right");
    }

    ngOnDestroy() {
        this.disconnectFirebase();
        if (this.view) {
        this.view.container = null;
        }
    }
}
