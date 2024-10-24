'use client'

import { useState, useEffect } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const postcode = result.components.postcode;
              const formattedAddress = result.formatted; // Get the formatted address
              if (postcode) {
                setZipCode(postcode);
                setAddress(formattedAddress); // Set the address
              } else {
                setError('Unable to find zip code for your location.');
              }
            } else {
              setError('Unable to find location information.');
            }
          } catch (error) {
            console.error('Error fetching location data:', error);
            setError('An error occurred while fetching your location data.');
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter your address manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your address manually.');
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call to get zip code from address
    // For now, we'll just set a dummy zip code
    setZipCode('12345');
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-background text-foreground mt-28 lg:mt-40">
      <h1 className="text-4xl mb-10">Ditt postnummer är</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : zipCode ? (
        <>
          <p className="text-8xl mb-8">{zipCode}</p>
          {address && <p className="mb-4">{address}</p>}
        </>
      ) : null}
    </div>
  );
}
