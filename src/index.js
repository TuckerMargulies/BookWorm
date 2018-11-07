import React, { Component } from "react";
import PropTypes from "prop-types";
import { configure, BarcodePicker as ScanditSDKBarcodePicker } from "scandit-sdk";
const api_key = process.env.scandit_web_api
// Configure the library and activate it with a license key
configure("ATv8fQ/EE3blD9UnpBcYh/AKMNP8NvxVMQi5ecgumEFDSsJrV32dMqN+NFy/WVWn+XU5H+0m6rH/egVK6Hvolx5KVDucT9ubInX9w74YFStgT6DwAxPTsxBCACZkLkNL0g+nCUPwfiiX2ltG+JFBsb4pmrpU8ohHmmGqHg6v3OklIxTt71SyBZA3zE1bgLzgKMXdKZHgG7I4DsdxLYOqPQYWooqyKEbPryVuP7VDiWjwtXfExF+CU3NihualbXaPw232Ogq5azKt1fYyaraJbx5i4FjkNOccliaoBmQ1n/uNdWjJfCv12mSti21S2G2GVr4Al+GLVj2KPydrcDXyhjzzeDsc6QsEj2vG81gcqxhub9PKzjZw/737HD2Na/b/eg2i4vGtbHFbxdWE4M+M8NacF3c8J79C3QQjTSq2Rn0ysBmHVGv7+ZenZego1M+U/k19z53iqSHLKWn/KqEhkHcBYSMFyqQiCTf1hEmhZyM35tYocejnrDbaCev+NBeKaHZOMvBY905Sp8EdYlmuATDFs1mbnbbUWjwrkmKOpTpzGJU0Pd4fX7oRTpPatAk2EqCo9mZpGqlwJyEnB6nq39UuoWOt8JUPqUgjlq4/mj84jG/ifhF9gDFGGRhxuSmRljRrzWE88r5yq1IQxQi+g2F3ybHLsJ8ISBYIy0gowqi9C6b0m2kc1bdn7x9Tx8hEWuSHgUB+3FMnL+b7poVGdsBHR6USS+t/C9tpQ63hLisWn1T8it0xdw9AUBSV2TB9xGf1ZG2cGHliYg+XnEs8NsXfPD/NBxFuYuUTkLg=").catch(error => {
  alert(error);
});

const style = {
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  margin: "auto",
  maxWidth: "1280px",
  maxHeight: "80%"
};

class BarcodePicker extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    playSoundOnScan: PropTypes.bool,
    vibrateOnScan: PropTypes.bool,
    scanningPaused: PropTypes.bool,
    guiStyle: PropTypes.string,
    videoFit: PropTypes.string,
    scanSettings: PropTypes.object,
    enableCameraSwitcher: PropTypes.bool,
    enableTorchToggle: PropTypes.bool,
    enableTapToFocus: PropTypes.bool,
    enablePinchToZoom: PropTypes.bool,
    accessCamera: PropTypes.bool,
    camera: PropTypes.object,
    cameraSettings: PropTypes.object,
    targetScanningFPS: PropTypes.number,
    onScan: PropTypes.func,
    onError: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    ScanditSDKBarcodePicker.create(this.ref.current, this.props).then(barcodePicker => {
      this.barcodePicker = barcodePicker;
      if (this.props.onScan != null) {
        barcodePicker.onScan(this.props.onScan);
      }
      if (this.props.onError != null) {
        barcodePicker.onScanError(this.props.onError);
      }
    });
  }

  componentWillUnmount() {
    if (this.barcodePicker != null) {
      this.barcodePicker.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    // These are just some examples of how to react to some possible property changes

    if (JSON.stringify(prevProps.scanSettings) !== JSON.stringify(this.props.scanSettings)) {
      this.barcodePicker.applyScanSettings(this.props.scanSettings);
    }

    if (prevProps.visible !== this.props.visible) {
      this.barcodePicker.setVisible(this.props.visible);
    }
  }

  render() {
    return <div ref={this.ref} style={style} />;
  }
}

export default BarcodePicker;
