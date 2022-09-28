import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status != 'granted') {
        Alert.alert('No permission to get location.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      const location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      }
      setLocation(location);
    })();
  }, []);

  const getLocation = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=JAcsRdRgyu1DAGalI6nGJRizSuA3m1VM&location=${address}`)
    .then(response => response.json())
    .then(data => {
      const location = {
        latitude: data.results[0].locations[0].latLng.lat,
        longitude: data.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      }
      setLocation(location);
    })
    .catch(err => {
      console.error(err);
    });
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        region={location}
      >
        <Marker 
          coordinate={location}
          title={address}
        />
      </MapView>

      <TextInput 
        style={styles.input}
        placeholder='Write an address' 
        onChangeText={ address => setAddress(address) } 
        value={address} 
      />

      <View style={styles.button}>
        <Button 
          title='Show' 
          onPress={getLocation} 
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderColor: 'grey',
    borderWidth: 0,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    paddingTop: 5,
  },
});