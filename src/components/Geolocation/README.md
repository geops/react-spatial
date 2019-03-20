#

This demonstrates the use of Geolocation.

```jsx
import React from  'react'
import Geolocation from 'react-spatial/components/Geolocation';
import BasicMap from 'react-spatial/components/BasicMap';
import OLMap from 'ol/Map';
import ConfigReader from 'react-spatial/ConfigReader';

class GeolocationExample extends React.Component {
  constructor(props) {
    super(props);

    this.center = [-10997148, 4569099];
    this.map = new OLMap({controls:[]});
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );
  }

  render() {
    return (
      <div className="tm-geolocation-example">
        <BasicMap
          map={this.map}
          center={this.center}
          zoom={3}
          layers={this.layers}
        />
        <Geolocation
          title='Lokalisieren'
          map={this.map}
          noCenterAfterDrag={true}
          onError={() => window.alert('Geolokalisierung war nicht erfolgreich')}
          colorOrStyleFunc={[0, 61, 133]}
        />
      </div>
    );
  }
}

<GeolocationExample />;
```
