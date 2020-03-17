import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableWithoutFeedback,Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default function App() {
  const finland = ', Finland';
  const [text, setText] = useState('Haaga-Helia UAS');
  const [map, setMap] = useState({
          latitude: 0, longitude: 0,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
});

//ask permission when rendering app
useEffect(() => { getLocation();
}, []);

  //fetch the location
  const fetchLocation = () => {
  fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=PYgVpcqfrzY0sjRhOwzMBRzCOAPANQ1c&location=${text}`)
  .then(res => res.json())
  .then(res=>
        {
          setMap({...map,
            latitude:res.results[0].locations[0].latLng.lat,
            longitude:res.results[0].locations[0].latLng.lng,
});
})}

//ask permission to get to current positionn
const getLocation = async () => {
    //Check permission
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        Alert.alert('No permission to access location');
}
    else {
        let currentLocation = await Location.getCurrentPositionAsync({});
        console.log(currentLocation.coords);
        setMap({...map,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        })
}; }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }} region={map}>
        <Marker
        coordinate={{latitude:map.latitude, longitude:map.longitude}}
        title={text} />
      </MapView>
      <TextInput
        style={{width: '100%', height: 30, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => setText(text)}
        value={text}
      />
      <Button onPress={fetchLocation} title="Search" />
    </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
