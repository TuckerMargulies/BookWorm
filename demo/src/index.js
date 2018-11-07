import React, { Component } from "react";
import { render } from "react-dom";
import { ScanSettings, Barcode } from "scandit-sdk";

import BarcodePicker from "../../src";

class Demo extends Component {
  render() {
    return (
      <BarcodePicker
        playSoundOnScan={false}
        vibrateOnScan={false}
        scanSettings={
          new ScanSettings({
            enabledSymbologies: ["qr", "ean8", "ean13", "upca", "upce", "code128", "code39", "code93", "itf"],
            codeDuplicateFilter: 1000
          })
        }
        onScan={scanResult => {
          console.log("stringify " +JSON.stringify(scanResult.barcodes[0].data))

          function bookSearch(){
            console.log(JSON.stringify(scanResult.barcodes[0].data))
            var search = JSON.stringify(scanResult.barcodes[0].data).replace(/\"/g, "");
            console.log(search.replace(/\"/g, ""));

            $.ajax({
              url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + search,
              dataType: "json",

              success: function(data) {

                for (let i = 0; i < data.items.length; i++){
                  document.getElementById('scandit-barcode-result').innerHTML += "<h2>" + data.items[i].volumeInfo.title + "</h2>"
                }
                console.log("https://www.googleapis.com/books/v1/volumes?q=isbn:" + search)
                console.log("google books data " + JSON.stringify(data))
              },
              type: 'GET'
            });
          }
          bookSearch()

          document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function(
            string,
            barcode
          ) {
            return string + Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + barcode.data + "<br>";
          },
          "");
        }}
        onError={error => {
          console.error(error.message);
        }}
      />
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
