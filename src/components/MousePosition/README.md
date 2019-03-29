#

This demonstrates the use of MousePosition.

```jsx
import React from 'react';;
import OLMap from 'ol/Map';
import BasicMap from 'react-spatial/components/BasicMap';
import LayerService from 'react-spatial/LayerService';
import ConfigReader from 'react-spatial/ConfigReader';
import MousePosition from 'react-spatial/components/MousePosition';

class MousePositionExample extends React.Component {
  constructor(props) {
    super(props);
     this.center = [1149722.7037660484, 6618091.313553318];
    this.map = new OLMap({controls:[]});
    this.state = {
      layerService: null
    }
  }

  componentDidMount() {
    const layers = ConfigReader.readConfig(
      this.map,
      treeData,
    );
    this.setState({
      layerService: new LayerService(layers)
    })
  }

  render() {
    return (
      <div className="tm-mouse-position-example">
        <BasicMap map={this.map} center={this.center} zoom={6} />
        <MousePosition map={this.map} projections={[
        {
          label: 'World Geodetic System 1984',
          value: 'EPSG:4326',
        },
        {
          label: 'Web mercator with custom output',
          value: 'EPSG:3857',
          format: (coord) => {
            const decimals = 4;
            let text = [];

            coord.forEach((input)=> {
                input = Math.round(parseFloat(input) * Math.pow(10, decimals)) /
                    Math.pow(10, decimals);
                input =input.toString();
                var parts = input.toString().split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
                text.push(parts.join());
            });
            return 'Coordinates: ' + text.join(' ');
          }
        },]}/>
      </div>
    )
  }
}

<MousePositionExample />;
```
