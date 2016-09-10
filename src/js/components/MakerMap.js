import React, { Component } from 'react';


import MapGL from 'react-map-gl';

class MakerMap extends Component {


  constructor() {
    super();
    this.state = {
      viewport: {
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      }
    };
  }

  render () {
    const {latitude, longitude, zoom} = this.state.viewport;
    return (
      <MapGL mapboxApiAccessToken='pk.eyJ1IjoibWVzaGVkbnoiLCJhIjoiY2lzcjFrMHZzMDI2djJvbXF0d2V4ZDZoMCJ9.XM3mpMPbJgIMNYWkjaHvKg'
        width={this.props.width} height={this.props.height - 72}
        startDragLngLat={[longitude, latitude]}
        latitude={latitude} longitude={longitude} zoom={zoom} onChangeViewport={(viewport) => {
          console.log('cool', viewport);
          this.setState({viewport});
          // Optionally call `setState` and use the state to update the map.
        }}
      />
    );
  }
};

export default MakerMap; // Enhanced component
