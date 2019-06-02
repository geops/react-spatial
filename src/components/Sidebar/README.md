#

This demonstrates the use of Responsive Sidebar.

```jsx
import React from 'react';
import BasicMap from 'react-spatial/components/BasicMap';
import ConfigReader from 'react-spatial/ConfigReader';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/Layer';
import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileImageSource from 'ol/source/TileImage';
import { getCenter} from 'ol/extent';
import OLMap from 'ol/Map';
import Sidebar from 'react-spatial/components/Sidebar';
import SidebarItem from 'react-spatial/components/SidebarItem';



class SidebarExample extends React.Component {
  constructor(props) {
    super(props);

       const extent = [599500, 199309, 600714, 200002];
    const resolutions = [
      6.927661,
      3.4638305,
      1.73191525,
      0.865957625, 
      0.4329788125,
      0.21648940625,
      0.108244703125,
    ];

    const layer = new Layer({
      name: 'Layer',
      olLayer: new TileLayer({
        extent: extent,
        source: new TileImageSource({
          tileUrlFunction: c =>
            '//plans.trafimage.ch/static/tiles/' +
            `bern_aussenplan/${c[0]}/${c[1]}/${c[2]}.png`,
          tileGrid: new TileGrid({
            origin: [extent[0], extent[1]],
            resolutions: resolutions,
          }),
        }),
      }),
    });
    this.center = getCenter(extent);
    this.layers = [layer];
  }

  sampleFunction() {
    alert('You can make any handler function.');
  }

  render() {
    return (
      <div className="tm-sidebar-example">
      
   <BasicMap center={this.center} zoom={17} layers={this.layers} />
      <Sidebar show> 
          <SidebarItem title="Zoom"/>
          <SidebarItem title="Save Map" clicked={()=>this.sampleFunction()}/>
          <SidebarItem title="Get info" clicked={()=>this.sampleFunction()}/>
       </Sidebar > 
      </div>
    );
  }
}

<SidebarExample />;
```
      