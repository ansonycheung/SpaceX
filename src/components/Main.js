import React, {Component} from "react";
import axios from "axios";
import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      satInfo: null,
      settings: null,
      isLoadingList: false
    };
  }

  showNearbySatellite = setting => {
    this.setState({
      settings: setting
    });
    this.fetchSatellite(setting);
  };

  fetchSatellite = setting => {
    // fetch data from the server
    // step1. get the setting
    const {latitude, longitude, elevation, altitude} = setting;
    // step2: config
    const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;
    // step3: send request
    //  - show spin and send request
    this.setState({
      isLoadingList: true
    });

    axios
    .get(url)
    .then(response => {
      console.log(response.data);
      // when fetching data succeed, hide spin and update satInfo
      this.setState({
        satInfo: response.data,
        isLoadingList: false
      });
    })
    .catch(error => {
      console.log("err in fetch satellite -> ", error);
    });
  };

  showMap = selected => {
    this.setState(preState => ({
      ...preState,
      isLoadingMap: true,
      satList: [...selected]
    }));
  };

  render() {
    const {satInfo} = this.state;
    return (
        <div className="main">
          <div className="left-side">
            <SatSetting onShow={this.showNearbySatellite}/>
            <SatelliteList
                satInfo={satInfo}
                isLoad={this.state.isLoadingList}
                onShowMap={this.showMap}
            />
          </div>
          <div className="right-side">
            <WorldMap/>
          </div>
        </div>
    );
  }
}

export default Main;
