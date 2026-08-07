import React from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const GoogleMap = ({latitude, longitude}) => (

    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: latitude, lng: longitude }}
            defaultZoom={3}
            gestureHandling='greedy'
            disableDefaultUI
        />
    </APIProvider>
);

export default GoogleMap;
