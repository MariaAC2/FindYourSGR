import { Component, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-scanner-dialog',
  templateUrl: './scanner-dialog.component.html',
  styleUrls: ['./scanner-dialog.component.scss']
})
export class ScannerDialogComponent implements AfterViewInit, OnDestroy {
  @Output() scanComplete = new EventEmitter<string>();

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
            facingMode: 'environment' // Utilizează camera din spate
          }
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader'], // Formate suportate
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
      this.scanComplete.emit(data.codeResult.code); // Transmite codul detectat
      this.stopScanner();
    });
  }

  stopScanner(): void {
    Quagga.stop();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
