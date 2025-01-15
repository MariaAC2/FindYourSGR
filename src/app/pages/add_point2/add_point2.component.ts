import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    OnDestroy,
    AfterViewInit,
    Optional
  } from "@angular/core";
  
import { MatDialogRef } from '@angular/material/dialog';
import esri = __esri; // Esri TypeScript Types

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
  
@Component({
  selector: 'app-add_point2',
  templateUrl: './add_point2.component.html',
  styleUrls: ['./add_point2.component.scss']
})

export class AddPoint2Component implements OnInit{
    @Output() mapLoadedEvent = new EventEmitter<boolean>();

    @ViewChild("mapViewPopup", { static: false }) private mapViewEl: ElementRef;
    isPopupVisible: boolean = false;

    map: esri.Map;
    view: esri.MapView;
    graphicsLayer: esri.GraphicsLayer;
    basemap = "streets-vector";
    center: Array<number> = [26.096306, 44.439663];
    inputValue: string = "";

    constructor(@Optional() private dialogRef: MatDialogRef<AddPoint2Component>) {}

    ngOnInit() {}

    onSave(): void {
        this.dialogRef.close(this.inputValue);
    }

    onClose(): void {
      this.dialogRef.close();
    }

    openPopup() {
        this.isPopupVisible = true;
    
        setTimeout(() => {
            if (!this.view) {
                console.log("MapView does not exist. Creating a new MapView...");

                if (!this.mapViewEl.nativeElement) {
                    console.error("Error: Map container is not ready.");
                    return;
                }
    
                this.map = new Map({
                    basemap: this.basemap,
                });
    
                this.view = new MapView({
                    container: this.mapViewEl.nativeElement,
                    map: this.map,
                    center: this.center, // Long, Lat
                    zoom: 12,
                });

                this.addGraphicsLayer();
                this.searchByAddress(this.inputValue);
    
                this.view.when(() => {
                    console.log("MapView successfully created and loaded.");
                    this.mapLoadedEvent.emit(true);
                }, (error) => {
                    console.error("MapView failed to load:", error);
                });
            } else {
                console.log("MapView already exists.");
            }
        }, 100); // Short delay to ensure DOM readiness
    }

    searchByAddress(address: string): void {
        if (!address || address.trim() === '') {
          alert('Please enter an address to search.');
          return;
        }
      
        const searchWidget = new Search({
          view: this.view, // Reference to your MapView
          popupEnabled: false, // Disable the default popup
          resultGraphicEnabled: false, // Disable the default result graphic
        });
      
        // Perform the search programmatically
        searchWidget.search(address).then((result) => {
          if (result.results.length > 0) {
            const firstResult = result.results[0];
      
            // Check if feature and geometry exist
            if (firstResult.results && firstResult.results[0].feature && firstResult.results[0].feature.geometry) {
              const geometry = firstResult.results[0].feature.geometry;
              console.log('Search result geometry:', geometry);
      
              // Add the result as a point on the map
              const pointSymbol = {
                type: 'simple-marker',
                color: [0, 122, 255, 0.8], // Blue with 80% opacity
                size: '20px',
                outline: {
                  color: [255, 255, 255], // White outline
                  width: 1,
                },
              };
      
              const pointGraphic = new Graphic({
                geometry: geometry,
                symbol: pointSymbol,
              });

              this.graphicsLayer.removeAll();
              this.graphicsLayer.add(pointGraphic);
            } else {
              console.error('Search result does not contain geometry.');
              alert('The search result does not have a valid location.');
            }
          } else {
            alert('No results found for the provided address.');
          }
        }).catch((err) => {
          console.error('Search error:', err);
        });
    }

    searchByCurrentLocation(): void {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
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
                } else {
                  console.error('No geometry found for the reverse geocoding result.');
                  alert('Unable to determine a location for your current position.');
                }
              } else {
                alert('No location found for your current position.');
              }
            }).catch((err) => {
              console.error('Error during reverse geocoding:', err);
              alert('Error while trying to determine your current location.');
            });
          },
          (error) => {
            console.error('Geolocation error:', error.message);
            alert('Failed to get your current location. Please enable location services.');
          }
        );
    }

    addGraphicsLayer() {
        this.graphicsLayer = new GraphicsLayer();
        this.map.add(this.graphicsLayer);    
    }

    closePopup() {
        this.isPopupVisible = false;
    }
}