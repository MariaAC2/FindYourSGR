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
    isMapVisible: boolean = false;

    map: esri.Map;
    view: esri.MapView;
    graphicsLayer: esri.GraphicsLayer;
    basemap = "streets-vector";
    center: Array<number> = [26.096306, 44.439663];
    inputValue: string = "";
    isSearch: boolean = false;
    isCurrentLocation: boolean = false;
    isInputReady: boolean = false;
    searchCoords: Point | null;
    currLocationCoords: Point | null;

    constructor(@Optional() private dialogRef: MatDialogRef<AddPoint2Component>) {}

    ngOnInit() {}

    onSave(): void {
        console.log("onSave triggered");
    
        // Extract coordinates for debugging
        const currentLocation = this.currLocationCoords
            ? {
                  latitude: this.currLocationCoords.latitude,
                  longitude: this.currLocationCoords.longitude,
              }
            : null;
    
        const searchLocation = this.searchCoords
            ? {
                  latitude: this.searchCoords.latitude,
                  longitude: this.searchCoords.longitude,
              }
            : null;
    
        console.log("Extracted Current Location Coordinates:", currentLocation);
        console.log("Extracted Search Location Coordinates:", searchLocation);
    
        // Validation: Ensure at least one location is available
        if (!currentLocation && !searchLocation) {
            console.error("No valid coordinates found to save.");
            alert("Please perform a search or select a current location before saving.");
            return;
        }

        if (!currentLocation && !searchLocation) {
            console.error("No valid coordinates found to save.");
            alert("Please perform a search or select a current location before saving.");
            return;
        }
    
        // Prepare data to save
        const saveData = {
            currentLocation,
            searchLocation,
        };
    
        console.log("Data to save:", saveData);
    
        // Close the dialog with the prepared data
        this.dialogRef.close(saveData);
    }
    

    // onSave(): void {
    //     console.log("onSave triggered");
    
    //     // Log the current state for debugging
    //     console.log("Current Location Coordinates:", this.currLocationCoords);
    //     console.log("Search Address Coordinates:", this.searchCoords);
    
    //     // Check if we have any valid coordinates to save
    //     if (this.currLocationCoords) {
    //         console.log("Saving current location...");
    //         console.log(`Latitude: ${this.currLocationCoords.latitude}, Longitude: ${this.currLocationCoords.longitude}`);
    //     } else if (this.searchCoords) {
    //         console.log("Saving search location...");
    //         console.log(`Latitude: ${this.searchCoords.latitude}, Longitude: ${this.searchCoords.longitude}`);
    //     } else {
    //         console.error("No coordinates found to save.");
    //         alert("Please perform a search or select a current location before saving.");
    //         return;
    //     }
    
    //     // Include additional logic for saving if needed
    //     const saveData = {
    //         currentLocation: this.currLocationCoords || null,
    //         searchLocation: this.searchCoords || null,
    //     };
    
    //     console.log("Data to save:", saveData);
    
    //     // Emit or close the dialog with the relevant data
    //     this.dialogRef.close(saveData);
    // }
    
    onClose(): void {
        this.dialogRef.close();
    }

    onCurrentLocationClick() {
        console.log("Cautarea in functie de locatia introdusa");
        this.searchByCurrentLocation()
        .then((coords) => {
            console.log(`Current location found: Latitude=${coords.point.latitude}, Longitude=${coords.point.longitude}`);
            this.currLocationCoords = coords.point;
            // alert(`Current location: Latitude=${coords.point.latitude}, Longitude=${coords.point.longitude}`);
        })
        .catch((error) => {
            console.error('Error fetching current location:', error);
            // alert('Failed to fetch current location.');
        });
    }

    onStartSearch() {
        console.log("Incep cautarea");
    }

    onSearchClick() {
        //console.log("")
        console.log("Cautarea in functie de adresa introdusa");
        this.searchByAddress(this.inputValue)
        .then((coords) => {
            if (coords) {
                console.log(`Current location found: Latitude=${coords.point.latitude}, Longitude=${coords.point.longitude}`);
                this.searchCoords = coords.point;
                // alert(`Address location: Latitude=${coords.latitude}, Longitude=${coords.longitude}`);
            } else {
                alert('No results found for the given address.');
            }
        })
        .catch((error) => {
            console.error('Error fetching address location:', error);
            // alert('Failed to fetch address location.');
        });
    }

    closeMap() {
        this.isMapVisible = false;
    }

    openMap() {
        this.isMapVisible = true;
    
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

    searchByAddress(address: string): Promise<{ point: Point } | null> {
        return new Promise((resolve, reject) => {
            if (!address || address.trim() === '') {
                return;
            }

            const searchWidget = new Search({
                view: this.view, // Reference to your MapView
                popupEnabled: false, // Disable the default popup
                resultGraphicEnabled: false, // Disable the default result graphic
            });
    
            searchWidget
            .search(address)
            .then((result) => {
                if (result.results && result.results.length > 0) {
                    const firstResult = result.results[0];
        
                    if (
                        firstResult.results &&
                        firstResult.results[0].feature &&
                        firstResult.results[0].feature.geometry
                    ) {
                        const point = firstResult.results[0].feature.geometry as Point;
        
                        console.log('Search result geometry:', point);
        
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
                            geometry: point,
                            symbol: pointSymbol,
                        });
        
                        this.graphicsLayer.removeAll();
                        this.graphicsLayer.add(pointGraphic);
        
                        // Resolve with the extracted point
                        resolve({ point });
                    } else {
                        console.error('Search result does not contain valid geometry or feature.');
                        alert('The search result does not have a valid location.');
                        resolve(null);
                    }
                } else {
                    console.error('No results found for the provided address.');
                    alert('No results found for the provided address.');
                    resolve(null);
                }
            })
            .catch((err) => {
                console.error('Search error:', err);
                alert('An error occurred during the search. Please try again.');
                reject(err);
            });      
        });  
    }

    searchByCurrentLocation(): Promise<{ point: Point }> {
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
                    const point = firstResult.results[0].feature.geometry as Point;
      
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
                      geometry: point, // Geometry of the result
                      symbol: pointSymbol, // Custom symbol
                    });
      
                    // Clear previous graphics and add the new point
                    this.graphicsLayer.removeAll();
                    this.graphicsLayer.add(pointGraphic);
      
                    // Resolve the pointGraphic wrapped in an object
                    resolve({ point });
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

    getAddressFromPoint(lat: number, lon: number): Promise<string | null> {
        const geocodeUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode';
    
        return fetch(`${geocodeUrl}?location=${lon},${lat}&f=json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch reverse geocoding results.');
                }
                return response.json();
            })
            .then((data) => {
                if (data.address && data.address.Match_addr) {
                    console.log('Address:', data.address.Match_addr);
                    return data.address.Match_addr; // Return the matched address
                } else {
                    console.warn('No address found for the given location.');
                    return null; // No address found
                }
            })
            .catch((error) => {
                console.error('Error during reverse geocoding:', error);
                return null; // Return null on error
            });
    }    

    addGraphicsLayer() {
        this.graphicsLayer = new GraphicsLayer();
        this.map.add(this.graphicsLayer);    
    }
}