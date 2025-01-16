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
  
  import CSVLayer from "@arcgis/core/layers/CSVLayer";
  import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
  import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
  
  import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
  import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
  import * as route from "@arcgis/core/rest/route.js";
  import Search from "@arcgis/core/widgets/Search";
  import PopupTemplate from '@arcgis/core/PopupTemplate';
  
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
    searchHistory: string[] = [];
    isHistoryVisible: boolean = false;
    isFavoritesVisible: boolean = false;
  
    constructor() { }
  
    ngOnInit() {
      this.initializeMap().then(() => {
        this.loaded = this.view.ready;
        this.mapLoadedEvent.emit(true);
      });
    }

    toggleHistory() {
        this.isHistoryVisible = !this.isHistoryVisible;
    }

    toggleFavorites() {
        this.isFavoritesVisible = !this.isFavoritesVisible;
    }

    onHistoryItemClick(term: string) {
        console.log(`Clicked on: ${term}`);
        // Perform additional actions, e.g., navigate or search with this term
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
        //this.addRouting();
        this.addSearchWidget();
        this.zoomOnPoint();
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
          view: this.view,
          includeDefaultSources: true,
        });
      
        searchWidget.on("search-complete", (event) => {
            const searchTerm = event.searchTerm;

            if (searchTerm && !this.searchHistory.includes(searchTerm)) {
                this.searchHistory.unshift(searchTerm);
                if (this.searchHistory.length > 5) {
                    this.searchHistory.pop();
                }
            }
        });
      
        this.view.ui.add(searchWidget, "top-right");
    }

    zoomOnPoint() {
        const customPopup = document.getElementById("customPopup");
        const popupContent = document.getElementById("popupContent");
        const closePopupBtn = document.getElementById("closePopupBtn");
        const favoriteBtn = document.getElementById("favoriteBtn");
        const routeBtn = document.getElementById("routeBtn");
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
    
        // Close the popup when the close button is clicked
        closePopupBtn.addEventListener("click", () => {
            customPopup.style.display = "none";
        });
    
        this.view.on("double-click", (event) => {
            this.removeRoutes();
            event.stopPropagation(); // Prevent default zoom behavior
    
            const screenPoint = {
                x: event.x,
                y: event.y,
            };
    
            // Perform hit test to find features
            this.view.hitTest(screenPoint).then((response) => {
                if (response.results.length > 0) {
                    const graphic = (response.results[0] as any).graphic;
                    const { longitude, latitude } = graphic.geometry;
    
                    // Set the popup content to the coordinates
                    popupContent.innerHTML = `
                        <p><strong>Longitude:</strong> ${longitude}</p>
                        <p><strong>Latitude:</strong> ${latitude}</p>
                    `;

                    // Zoom to the feature
                    this.view.goTo({
                        target: graphic.geometry,
                        zoom: 15
                    }).then(() => {
                        // Ensure the popup dimensions are available
                        customPopup.style.display = "block"; // Temporarily make it visible
                        const popupWidth = customPopup.offsetWidth; // Get the width
                        const popupHeight = customPopup.offsetHeight; // Get the height
                        customPopup.style.display = "none"; // Hide it again

                        // Position the popup at the feature's location
                        const screenCoords = this.view.toScreen(graphic.geometry); // Use the feature's geometry
                        customPopup.style.left = `${screenCoords.x - popupWidth / 2}px`; // Center horizontally
                        customPopup.style.bottom = `${screenCoords.y + 50}px`; // Position above the feature
                        customPopup.style.display = "block"; // Display the popup
                    });

                    setTimeout(() => {
                        if (favoriteBtn) {
                            favoriteBtn.addEventListener('click', () => {
                                favoriteBtn.classList.toggle('favorited'); // Toggle green color
                                if (favoriteBtn.classList.contains('favorited')) {
                                    console.log("Added to favorites:", { longitude, latitude });
                                } else {
                                    console.log("Removed from favorites:", { longitude, latitude });
                                }
                            });
                        }

                        if (routeBtn) {
                          routeBtn.addEventListener('click', () => {
                            this.searchByCurrentLocation()
                                .then((coords) => {
                                  customPopup.style.display = "none";
                                  const { pointGraphic } = coords;
                                  console.log('Point:', coords);
                                  this.calculateRoute(routeUrl, pointGraphic, graphic);
                                  
                                })
                                .catch((error) => {
                                  console.error('Error:', error);
                            });          
                        });
                        }
                    }, 0);
                }
            });
        });
    }
    
    // Add to favorite method
    addToFavorite(graphic: any) {
        console.log("Added to favorite:", graphic);
        alert(`Feature with longitude ${graphic.geometry.longitude} and latitude ${graphic.geometry.latitude} added to favorites.`);
    }
    
    
    searchByCurrentLocation(): Promise<{ pointGraphic: Graphic }> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          reject('Geolocation is not supported by your browser.');
          return;
        }
    
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
    
            const point = new Point({
              longitude: longitude,
              latitude: latitude,
            });
    
            const searchWidget = new Search({
              view: this.view, // Reference to your MapView
              popupEnabled: false, // Disable default popup
              resultGraphicEnabled: false, // Prevent default result graphic
            });
    
            // Perform reverse geocoding
            searchWidget.search(point).then((result) => {
              if (result.results.length > 0) {
                const firstResult = result.results[0];
    
                if (firstResult.results && firstResult.results[0].feature && firstResult.results[0].feature.geometry) {
                  const geometry = firstResult.results[0].feature.geometry;
    
                  console.log('Search result geometry:', geometry);
                  console.log('Search result (current location):', geometry);
    
                  // Create a custom symbol for the point
                  const pointSymbol = {
                    type: 'simple-marker', // Simple marker symbol
                    color: [0, 255, 255, 0.8], // Blue with 80% opacity
                    size: '20px',
                    outline: {
                      color: [255, 255, 255], // White outline
                      width: 1,
                    },
                  };
    
                  const pointGraphic = new Graphic({
                    geometry: geometry, // Geometry of the result
                    symbol: pointSymbol, // Custom symbol
                  });
    
                  // Clear previous graphics and add the new point
                  this.graphicsLayer.removeAll();
                  this.graphicsLayer.add(pointGraphic);
    
                  // Resolve the pointGraphic wrapped in an object
                  resolve({ pointGraphic });
                } else {
                  console.error('No geometry found for the reverse geocoding result.');
                  alert('Unable to determine a location for your current position.');
                  reject('No geometry found for the reverse geocoding result.');
                }
              } else {
                alert('No location found for your current position.');
                reject('No location found for your current position.');
              }
            }).catch((err) => {
              console.error('Error during reverse geocoding:', err);
              alert('Error while trying to determine your current location.');
              reject('Error during reverse geocoding.');
            });
          },
          (error) => {
            console.error('Geolocation error:', error.message);
            alert('Failed to get your current location. Please enable location services.');
            reject('Failed to get your current location.');
          }
        );
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
  
    async calculateRoute(routeUrl: string, stop1: Graphic, stop2: Graphic) {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: [stop1,stop2]
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
          color: [79, 91, 102],
          width: 3
        };
        this.graphicsLayerRoutes.graphics.add(result.route);
      }
      // if (data.routeResults.length > 0) {
      //   this.showDirections(data.routeResults[0].directions.features);
      // } else {
      //   alert("No directions found");
      // }
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
  