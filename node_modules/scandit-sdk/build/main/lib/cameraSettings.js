"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CameraSettings;
(function (CameraSettings) {
    /**
     * Video frame resolution request (not guaranteed to be precise depending on device, could be imprecise/lower).
     */
    let ResolutionPreference;
    (function (ResolutionPreference) {
        /**
         * Resolution of around 1080p (or less).
         */
        ResolutionPreference[ResolutionPreference["FULL_HD"] = 0] = "FULL_HD";
        /**
         * Resolution of around 720p (or less).
         */
        ResolutionPreference[ResolutionPreference["HD"] = 1] = "HD";
    })(ResolutionPreference = CameraSettings.ResolutionPreference || (CameraSettings.ResolutionPreference = {}));
})(CameraSettings = exports.CameraSettings || (exports.CameraSettings = {}));
//# sourceMappingURL=cameraSettings.js.map