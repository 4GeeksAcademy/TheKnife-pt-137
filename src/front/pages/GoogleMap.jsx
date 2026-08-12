import React from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const GoogleMap = ({latitude, longitude, setCoordsData}) => (
        <Map
            style={{ width: '100%', height: '620px' }}
            defaultCenter={{ lat: latitude, lng: longitude }}
            defaultZoom={15}
            gestureHandling='greedy'
            disableDefaultUI
            mapId="DEMO_MAP_ID"
            ><AdvancedMarker position={{ lat: latitude, lng: longitude }} draggable={true} onDragEnd={(e) => {
                const newLat = e.latLng.lat()
                const newLng = e.latLng.lng()
                setCoordsData(prev => ({
                    ...prev,
                    latitude: newLat,
                    longitude: newLng
                }))
            }} /></Map>
            
);

export default GoogleMap;
