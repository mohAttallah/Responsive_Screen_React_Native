import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as Font from 'expo-font';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import PokemonScreen from './screens/Pokemon';
import PalyerScreen from './components/Player';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import VideoControlers from "./screens/VideoControlers"
import { Provider } from 'react-redux';
import store from './redux/store';
import MainPlayerScreen from './screens/MainPlayer';

export default function App() {
  const Stack = createStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);


  // if (!appIsReady) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Pokemon" component={PokemonScreen} />
          <Stack.Screen name="VideoControlers" component={VideoControlers} />
          <Stack.Screen name="MainPlayer" component={MainPlayerScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
