"use client";

import { FC, useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import { checkCameraAvailability } from "@/utils/cameraUtils";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

interface QuaggaResult {
  boxes: { x: number; y: number; w: number; h: number }[]; // Array of box coordinates
  box: { x: number; y: number; w: number; h: number }; // Current bounding box
  codeResult?: {
    code: string;
  };
}

interface QuaggaDetectedData {
  codeResult: {
    code: string;
  };
}

const BarcodeScanner: FC<BarcodeScannerProps> = ({ onDetected }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initScanner = async () => {
      const isCameraAvailable = await checkCameraAvailability();
      if (!isCameraAvailable) {
        setError("No camera found or camera access denied.");
        return;
      }

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode: "environment", // Try the back camera
            },
            target: scannerRef.current,
            area: {
              // Restrict scan area for better performance
              top: "0%", // Percentage of the height of the screen
              right: "0%", // Percentage of the width of the screen
              left: "0%", // Percentage of the width of the screen
              bottom: "0%", // Percentage of the height of the screen
            },
          },
          decoder: {
            readers: [
              "code_128_reader", // Common format for barcodes
              "ean_reader", // European Article Numbers
              "ean_8_reader", // Short EAN
              "upc_reader", // Universal Product Code
              "upc_e_reader", // Short UPC
              "code_39_reader", // Code 39
              "code_93_reader", // Code 93
              "i2of5_reader", // ITF
              "qr_reader", // QR Code
              "datamatrix_reader",
            ],
            debug: {
              drawBoundingBox: true, // Show the bounding box around detected barcodes
              drawScanline: true, // Show the scanning line
            },
          },
          locator: {
            halfSample: true, // Speed up detection
            patchSize: "medium", // Options: x-small, small, medium, large
          },
        },
        (err: Error | null) => {
          if (err) {
            console.error("Quagga Initialization Error:", err);
            setError("Unable to initialize barcode scanner.");
            return;
          }
          Quagga.start();

          // Handle processed frames
          Quagga.onProcessed((result: QuaggaResult) => {
            const drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
              if (result.boxes) {
                Quagga.canvas.clear();
                result.boxes
                  .filter((box) => box !== result.box)
                  .forEach((box) =>
                    Quagga.canvas.drawPath(box, { x: 0, y: 1 }, drawingCanvas, {
                      color: "green",
                      lineWidth: 2,
                    })
                  );
              }

              if (result.box) {
                Quagga.canvas.drawPath(
                  result.box,
                  { x: 0, y: 1 },
                  drawingCanvas,
                  { color: "blue", lineWidth: 2 }
                );
              }

              if (result.codeResult && result.codeResult.code) {
                console.log(`Detected Code: ${result.codeResult.code}`);
              }
            }
          });

          // Handle detected barcodes
          Quagga.onDetected((data: QuaggaDetectedData) => {
            console.log(`Detected barcode: ${data.codeResult.code}`);
            onDetected(data.codeResult.code);
            Quagga.stop();
          });
        }
      );
    };

    initScanner();

    return () => {
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <div
        ref={scannerRef}
        style={{ width: "100%", height: "300px", position: "relative" }}
        className="video-container"
      />
    </div>
  );
};

export default BarcodeScanner;
