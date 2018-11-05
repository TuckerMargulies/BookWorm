import * as ScanditSDK from 'scandit-sdk';

import { Config } from './config';
import { Elements } from './elements';
import { ViewFunctions } from './helpers';

/*
 * Core functionality, including barcode scanning
 */

export class App {
    constructor() {
        this.continuousScanning = false;
        this.picker;

        // Create a basic scanner settings object
        this.scanSettings = new ScanditSDK.ScanSettings();
        this.scanSettings.enableSymbologies([
            ScanditSDK.Barcode.Symbology.EAN13,
            ScanditSDK.Barcode.Symbology.EAN8,
            ScanditSDK.Barcode.Symbology.CODE39,
            ScanditSDK.Barcode.Symbology.CODE93,
            ScanditSDK.Barcode.Symbology.CODE128,
            ScanditSDK.Barcode.Symbology.UPCA,
            ScanditSDK.Barcode.Symbology.UPCE,
            ScanditSDK.Barcode.Symbology.INTERLEAVED_2_OF_5,
            ScanditSDK.Barcode.Symbology.QR,
        ]);

        this.scanSettings.getSymbologySettings(ScanditSDK.Barcode.Symbology.CODE128).setActiveSymbolCountsRange(1, 20);

        this.createPickerOptions = {
            visible: true,
            scanningPaused: true,
            accessCamera: false,
            scanSettings: this.scanSettings,
        };
    }

    handleError(error) {
        // In a real application, you'd handle errors properly, but in development, we just want to be aware if they happen
        alert(error);
    }

    /**
     * Start the app by starting the scanner in the background and showing the settings
     * 
     */
    start() {
        this.startScanner().then(() => ViewFunctions.showSettings());
    }

    /**
     * Configure the scanner and create a barcode picker
     * @see http://docs.scandit.com/stable/web/globals.html#configure
     *
     */
    startScanner() {
        return ScanditSDK.configure(Config.licenseKey, { engineLocation: Config.engineLocation})
            .then(() => this.createPicker(this.createPickerOptions))
            .catch(this.handleError);
    }

    /**
     * Create the barcode picker in the container element and attach the callbacks
     * @see http://docs.scandit.com/stable/web/classes/barcodepicker.html#create
     *
     * @param {object} options The options used to create the picker
     */
    createPicker(options) {
        if (this.picker) {
            this.picker.destroy();
        }

        return ScanditSDK.BarcodePicker.create(Elements.scannerContainer, options)
            .then(barcodePicker => {
                this.picker = barcodePicker;

                // Setup the picker callbacks
                this.picker.onScan(this.onScan.bind(this));
                this.picker.onScanError(this.handleError.bind(this));
                return this.picker;
            })
            .catch(this.handleError);
    }

    /**
     * After scanning, pause the scanner if we're not scanning continuously and show the scanned barcodes
     * @see http://docs.scandit.com/stable/web/classes/barcodepicker.html#onscan
     *
     * @param {ScanResult} scanResult 
     */
    onScan(scanResult) {
        if (!this.continuousScanning) {
            this.picker.pauseScanning();
            ViewFunctions.setScanningUI(true);
        }
        ViewFunctions.showBarcodes(scanResult.barcodes);
    }

    /**
     * Get the latest settings used by the scanner and apply it to the settings page
     */
    applySettingsToPage() {
        ViewFunctions.setCameraButtonsEnabled()

        Elements.symbology.all.forEach(symbologyElement => {
            const enabled = this.scanSettings.isSymbologyEnabled(symbologyElement.symbology());
            symbologyElement.setChecked(enabled);
        });

        Elements.guiStyle.all.forEach(guiStyleElement => {
            const enabled = guiStyleElement.guiStyle() === ScanditSDK.BarcodePicker.GuiStyle[this.picker.guiStyle];
            guiStyleElement.setChecked(enabled);
        })

        Elements.restrictedArea.setArea(this.scanSettings.getSearchArea());

        Elements.beepEnabled.checked = this.picker.isPlaySoundOnScanEnabled();
        Elements.vibrationEnabled.checked = this.picker.isVibrateOnScanEnabled();
        Elements.duplicateCodeFilter.value = this.scanSettings.getCodeDuplicateFilter();
        Elements.maxCodesPerFrame.value = this.scanSettings.getMaxNumberOfCodesPerFrame();
        Elements.mirroringEnabled.checked = this.picker.isMirrorImageEnabled();

        Elements.camera.setActive(this.picker.getActiveCamera() ? this.picker.getActiveCamera().cameraType : undefined);
    }

    /**
     * Get the settings from the settings page and apply it to the scanner
     */
    applySettingsToScanner() {
        Elements.symbology.allEnabledValue().forEach(symbology => this.scanSettings.enableSymbologies(symbology));
        Elements.symbology.allDisabledValue().forEach(symbology => this.scanSettings.disableSymbologies(symbology));

        // If the restricted area toggle is on, set the restricted search area where barcodes are scanned
        if (Elements.restrictedArea.isRestricted()) {
            this.scanSettings.setSearchArea(Elements.restrictedArea.value());
        } else {
            this.scanSettings.setSearchArea({width: 1, height: 1, x: 0, y: 0});
        }

        // Set the code duplicate filter
        this.scanSettings.setCodeDuplicateFilter(parseInt(Elements.duplicateCodeFilter.value, 10));
        // Set the max number of barcodes per frame that can be recognized
        this.scanSettings.setMaxNumberOfCodesPerFrame(parseInt(Elements.maxCodesPerFrame.value, 10));

        this.applyPickerSettings({
            guiStyle: Elements.guiStyles.active(),
            soundEnabled: Elements.beepEnabled.checked,
            vibrationEnabled: Elements.vibrationEnabled.checked,
            mirroringEnabled: Elements.mirroringEnabled.checked,
            scanSettings: this.scanSettings,
        })
    }

    /**
     * Set the camera type that should be active
     *
     * @see http://docs.scandit.com/stable/web/enums/camera.type.html
     * @param {CameraType} cameraType
     * @returns {Promise<BarcodePicker>}
     */
    setEnabledCamera(cameraType) {
        return ScanditSDK.CameraAccess.getCameras()
            .then(cameras => {
                const newActiveCamera = cameras.filter(camera => camera.cameraType === cameraType)[0];
                return this.picker.setActiveCamera(newActiveCamera);
            });
    }

    /**
     * Apply settings to the picker
     *
     * @param {object} pickerSettings
     * @param {CameraType} pickerSettings.cameraType
     * @param {GuiStyle} pickerSettings.guiStyle
     * @param {boolean} pickerSettings.soundEnabled
     * @param {boolean} pickerSettings.vibrationEnabled
     * @param {boolean} pickerSettings.mirroringEnabled
     * @param {ScanSettings} pickerSettings.scanSettings
     * @returns {Promise<BarcodePicker>}
     */
    applyPickerSettings({
        guiStyle,
        soundEnabled,
        vibrationEnabled,
        mirroringEnabled,
        scanSettings,
    }) {
        this.picker.setGuiStyle(guiStyle)
        this.picker.setPlaySoundOnScanEnabled(soundEnabled);
        this.picker.setVibrateOnScanEnabled(vibrationEnabled);
        this.picker.setMirrorImageEnabled(mirroringEnabled);
        this.picker.applyScanSettings(scanSettings);
        return this.picker;
    }
}
