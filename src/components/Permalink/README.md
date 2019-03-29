#

This demonstrates the use of Permalink.

```jsx
import React from  'react'
import Permalink from 'react-spatial/components/Permalink';
import BasicMap from 'react-spatial/components/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from '../../ConfigReader';

class PermalinkExample extends React.Component {
  constructor(props) {
    super(props);
    this.map = new OLMap({controls:[]});
    this.center = [-10997148, 4569099];
    this.zoom = 3;

    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );

    this.state = {
      params: {
        zoom: this.zoom,
        x: this.center[0],
        y: this.center[1],
      },
    };
  }

  onMapMoved(evt) {
    const newZoom = evt.map.getView().getZoom();
    const newCenter = evt.map.getView().getCenter();

    if (this.zoom !== newZoom) {
      this.zoom = newZoom;
    }

    if (this.center[0] !== newCenter[0] || this.center[1] !== newCenter[1]) {
      this.center = newCenter;
    }

    this.setState({
      params: {
        zoom: this.zoom,
        x: this.center[0],
        y: this.center[1],
      },
    });
  }

  render() {
    const { params } = this.state;

    return (
      <div className="tm-permalink-example">
        <BasicMap
          map={this.map}
          center={this.center}
          onMapMoved={evt => this.onMapMoved(evt)}
          zoom={this.zoom}
          layers={this.layers}
        />
        <Permalink params={params} />
      </div>
    );
  }
}

<PermalinkExample />;
```
