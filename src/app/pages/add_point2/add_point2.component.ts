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
import Config from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import * as route from "@arcgis/core/rest/route.js";
  
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
    
                // Check if the DOM element is ready
                if (!this.mapViewEl.nativeElement) {
                    console.error("Error: Map container is not ready.");
                    return;
                }
    
                const map = new Map({
                    basemap: this.basemap,
                });
    
                this.view = new MapView({
                    container: this.mapViewEl.nativeElement,
                    map: map,
                    center: this.center, // Long, Lat
                    zoom: 12,
                });
    
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
      

    closePopup() {
        this.isPopupVisible = false;
    }
}