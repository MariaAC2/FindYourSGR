import { Component, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-scanner-dialog',
  templateUrl: './scanner-dialog.component.html',
  styleUrls: ['./scanner-dialog.component.scss']
})
export class ScannerDialogComponent implements AfterViewInit, OnDestroy {
  @Output() scanComplete = new EventEmitter<string>();

  isPopupActive: boolean = true; // Controls the visibility of the pop-up

  ngAfterViewInit(): void {
    this.initScanner();
  }

  initScanner(): void {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'environment' // Use the rear camera
          }
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader'], // Supported formats
        }
      },
      (err) => {
        if (err) {
          console.error('QuaggaJS initialization error:', err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      console.log('Code detected:', data.codeResult.code);
      this.scanComplete.emit(data.codeResult.code); // Emit the detected code
      this.stopScanner();
    });
  }

  stopScanner(): void {
    Quagga.stop();
    this.isPopupActive = false; // Close the pop-up
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
