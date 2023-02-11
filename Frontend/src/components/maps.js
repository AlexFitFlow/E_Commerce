import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import env from "react-dotenv";
import { useState } from 'react';
// require('dotenv').config();
const libraries = ["places"]

export default function Map() {
console.log("Map component re-rendering");

// Loads the map using API KEY
const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries
});

const [selectedMarker, setSelectedMarker] = useState(null);
console.log("selectedMarker:", selectedMarker);

// This returns while map is being loaded
if (!isLoaded) return <div>Loading...</div>
return (
    <GoogleMap 
        key={selectedMarker}
        zoom={12}
        center={{lat: 34.1711, lng: -118.3464}} 
        mapContainerClassName='map-container previewShadow3'
    >
        <Marker 
        position={{ lat: 34.1631, lng: -118.3464 }} 
        icon={{
            url: '/assets/office.jpg',
            scaledSize: new window.google.maps.Size(70, 70),
        }}
        onClick={() => {
            console.log('Marker clicked');
            setSelectedMarker(true);
        }}
        />
        {selectedMarker && (
        <InfoWindow
        position={{ lat: 34.1821, lng: -118.3464 }}
        onCloseClick={() => setSelectedMarker(null)}
        >
        <div style={{ textAlign: 'center' }}>
            <h4 >Main Office</h4>
            <p style={{ color: 'black', marginBottom: '0.5rem', textDecorationLine: 'underline' }}>Fitness Warehouse</p>
            <p style={{ color: 'black', marginBottom: '0.5rem' }}> <i className="fa fa-phone"></i> (818)-526-6367</p>
            <p style={{ color: 'black', marginBottom: '0.5rem' }}> <i className="fa fa-clock"></i> 9-5 Mon-Fri</p>

        </div>
        </InfoWindow>
        )}
    </GoogleMap>
    
    )
}



