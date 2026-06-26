import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function BarcodeScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader"></div>;
}

export default BarcodeScanner;