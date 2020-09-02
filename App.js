//React Imports
import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, AsyncStorage } from 'react-native';

//Navigator Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { Button, Icon } from 'native-base'
//Pages Imports
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import ForgotPassword from './Pages/Forgotpassword';
import Signup from './Pages/Signup';
import UploadImage from './Pages/UploadImage';
import CheckImage from './Pages/CheckImage';







export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.disableYellowBox = true; 

    return (
      
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="LoginPage" component={LoginPage}

            options={{
              title: 'Login',
              headerShown: false,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#08B6CE',
              }
            }}
          />
          <Stack.Screen name="HomePage" component={HomePage} options={{
            title: 'Home',
            
            headerShown: false,
            headerLeft: () => (
              <Button transparent onPress={() => {

              }}>
                <Icon name="menu" />

              </Button>
            )
          }} />
          <Stack.Screen name="ForgotPage" component={ForgotPassword} 
          options={{
            title:''
          }}
          
          />
          <Stack.Screen name="SignupPage" component={Signup} options={{
            title: 'Home',
            headerShown: false
          }} />
          <Stack.Screen name="UploadPage" component={UploadImage} />
          <Stack.Screen name="CheckImagePage" component={CheckImage} options={{
            headerShown: false
          }} />
        </Stack.Navigator>
      </NavigationContainer >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
