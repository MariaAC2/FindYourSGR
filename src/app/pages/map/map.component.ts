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
  
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
  import CSVLayer from "@arcgis/core/layers/CSVLayer";
  import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
  import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
  
  import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
  import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
  import * as route from "@arcgis/core/rest/route.js";
  import Search from "@arcgis/core/widgets/Search";
  
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
    graphicsLayerUserPoints: esri.GraphicsLayer;
    graphicsLayerRoutes: esri.GraphicsLayer;
    trailheadsLayer: esri.FeatureLayer;
  
    zoom = 10;
    center: Array<number> = [26.096306, 44.439663];
    basemap = "streets-vector";
    loaded = false;
    directionsElement: any;
  
    constructor() { }
  
    ngOnInit() {
      this.initializeMap().then(() => {
        this.loaded = this.view.ready;
        this.mapLoadedEvent.emit(true);
      });
    }
  
    async initializeMap() {
      try {
        Config.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJP5XL48yDX-cAW0ysqARN5fvEJgMDmJHvPA9NIk4Wevr99IpgJOxKkfCQcvGVEVfL4w17yZh86-Eh4CiggjpmBw27sLZJOl7TAeROESp2edX4dbQf5PoDJMZc1JXzuNzsbgOX8KIteaFkdk5pLOqlStd65eVRjrzapERuOLGndjRoyudrrziRpdGGPsqdFdXGXIKZUWpcx68DxX-hTOJ4E.AT1_rrHRS8gn";
  
        const mapProperties: esri.WebMapProperties = {
          basemap: this.basemap
        };
        this.map = new WebMap(mapProperties);

        this.addGraphicsLayer();
        this.addFeatureLayers();
  
        const mapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: this.center,
          zoom: this.zoom,
          map: this.map
        };
        this.view = new MapView(mapViewProperties);
  
        this.view.on('pointer-move', ["Shift"], (event) => {
          const point = this.view.toMap({ x: event.x, y: event.y });
          console.log("Map pointer moved: ", point.longitude, point.latitude);
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

    addFeatureLayers() {
        if (!this.map) {
            console.error('Map is not initialized. Cannot add layers.');
            return;
        }

        // Puncte SGR Lidl
        const csvLayerLidl = new CSVLayer({
            url: "./assets/PuncteSGRLidl.csv",
            copyright: "Puncte SGR Lidl"
        });
    
        const simpleMarkerSymbolLidl = {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: "./assets/Lidl-Logo.png", // Path to your image
            width: "24px", // Set the width of the logo
            height: "24px" // Set the height of the logo
        };

        // Assign the renderer using SimpleRenderer
        csvLayerLidl.renderer = new SimpleRenderer({
            symbol: simpleMarkerSymbolLidl as any
        });
    
        // Add the CSV Layer to the map
        csvLayerLidl.when(() => {
            console.log("CSV Layer loaded successfully.");
        }).catch((error) => {
            console.error("Error loading CSV Layer:", error);
        });
        
        this.map.add(csvLayerLidl, 0);

        // Puncte SGR Kaufland
        const csvLayerKaufland = new CSVLayer({
            url: "./assets/PuncteSGRKaufland.csv",
            copyright: "Puncte SGR Kaufland"
        });
    
        const simpleMarkerSymbolKaufland = {
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: "./assets/Kaufland-Logo.png", // Path to your image
            width: "24px", // Set the width of the logo
            height: "24px" // Set the height of the logo
        };

        // Assign the renderer using SimpleRenderer
        csvLayerKaufland.renderer = new SimpleRenderer({
            symbol: simpleMarkerSymbolKaufland as any
        });
    
        // Add the CSV Layer to the map
        csvLayerKaufland.when(() => {
            console.log("CSV Layer loaded successfully.");
        }).catch((error) => {
            console.error("Error loading CSV Layer:", error);
        });
        
        this.map.add(csvLayerKaufland, 0);

        // Puncte SGR Carrefour
        const csvLayerCarrefour = new CSVLayer({
            url: "./assets/PuncteSGRCarrefour.csv",
            copyright: "Puncte SGR Carrefour"
        });
    
        const simpleMarkerSymbolCarrefour ={
            type: "picture-marker", // autocasts as new PictureMarkerSymbol()
            url: "./assets/Carrefour-Logo.png", // Path to your image
            width: "24px", // Set the width of the logo
            height: "24px" // Set the height of the logo
        };

        // Assign the renderer using SimpleRenderer
        csvLayerCarrefour.renderer = new SimpleRenderer({
            symbol: simpleMarkerSymbolCarrefour as any
        });
    
        // Add the CSV Layer to the map
        csvLayerCarrefour.when(() => {
            console.log("CSV Layer loaded successfully.");
        }).catch((error) => {
            console.error("Error loading CSV Layer:", error);
        });
        
        this.map.add(csvLayerCarrefour, 0);
    }

    
  
    addGraphicsLayer() {
      this.graphicsLayer = new GraphicsLayer();
      this.map.add(this.graphicsLayer);
      this.graphicsLayerUserPoints = new GraphicsLayer();
      this.map.add(this.graphicsLayerUserPoints);
      this.graphicsLayerRoutes = new GraphicsLayer();
      this.map.add(this.graphicsLayerRoutes);
    }

    addSearchWidget() {
        const searchWidget = new Search({
            view: this.view
        });
        this.view.ui.add(searchWidget, "top-right");
    }
  
    addRouting() {
      const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
      this.view.on("click", (event) => {
        this.view.hitTest(event).then((elem: esri.HitTestResult) => {
          if (elem && elem.results && elem.results.length > 0) {
            let point: esri.Point = elem.results.find(e => e.layer === this.trailheadsLayer)?.mapPoint;
            if (point) {
              console.log("get selected point: ", elem, point);
              if (this.graphicsLayerUserPoints.graphics.length === 0) {
                this.addPoint(point.latitude, point.longitude);
              } else if (this.graphicsLayerUserPoints.graphics.length === 1) {
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
  
      this.graphicsLayerUserPoints.add(pointGraphic);
    }
  
    removePoints() {
      this.graphicsLayerUserPoints.removeAll();
    }
  
    removeRoutes() {
      this.graphicsLayerRoutes.removeAll();
    }
  
    async calculateRoute(routeUrl: string) {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: this.graphicsLayerUserPoints.graphics.toArray()
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
      if (this.view) {
        this.view.container = null;
      }
    }
  }
  