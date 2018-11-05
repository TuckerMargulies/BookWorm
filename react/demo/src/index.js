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
          console.log('onScan ' + scanResult)
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

function bookSearch(){
  var search = document.getElementById('scandit-barcode-result').value
  console.log(document.getElementById('scandit-barcode-result').value)
  $.ajax({
    url: "https://www.googleapis.com/book/v1/isbn?q=" + search,
    dataType: "json",

    success: function(data) {
      console.log(data)
    },
    type: 'GET'
  });
}

document.getElementById('scandit-barcode-result').addEventListener('click', bookSearch, false)
console.log(document.getElementById('scandit-barcode-result'))
render(<Demo />, document.querySelector("#demo"));
