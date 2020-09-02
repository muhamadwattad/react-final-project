import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Vibration, Button, Image, Alert, AsyncStorage, Navigator } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigationFocus } from "react-navigation";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera'


class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      picUri: 'https://f6h8q2y9.stackpathcdn.com/wp-content/uploads/2018/04/google.jpg',
      uplodedPicUri: 'https://f6h8q2y9.stackpathcdn.com/wp-content/uploads/2018/04/google.jpg'
    }
    this.uplodedPicPath = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadFiles/";
  }


  async componentDidMount() {

    this._unsubscribeFocus = this.props.navigation.addListener('focus', async (payload) => {
      console.log('will focus', payload);
      const { status } = await Camera.requestPermissionsAsync();
      this.setState({
        hasCameraPermission: status === 'granted', st: 'focus'
      })
    });
    this._unsubscribeBlur = this.props.navigation.addListener('blur', (payload) => {
      this.setState({ st: 'blur' })
    });



  }
  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
    this.camera = null;
  }
 
  chooseimage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //allowsEditing: true,
      //aspect: [4, 3],
    });
    if (!result.cancelled)
      this.props.navigation.navigate('CheckImagePage', { uri: result.uri });
  }

  btnpic = async () => {
    let photo = await this.camera.takePictureAsync({ quality: 0.7});
    this.props.navigation.navigate('CheckImagePage', { uri: photo.uri });
    Vibration.vibrate();
  }


  render() {
    if (this.state.hasCameraPermission === null)
      return <View />
    if (this.state.hasCameraPermission === false)
      return <Text>No access to camera</Text>


    if (this.state.st == 'focus') {
      console.log('render');
      return (


        <Camera ref={ref => { this.camera = ref }} style={{ flex: 1 }} type={this.state.type} >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',

            }}>
            <TouchableOpacity
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 570 }}>
                <MaterialCommunityIcons name="image" size={26} color='white' style={{ marginBottom: 10, alignSelf: 'flex-start', marginLeft: 12 }} onPress={this.chooseimage} />
                <MaterialCommunityIcons name="camera" size={26} color='white' style={{ marginBottom: 10, alignSelf: 'center' }} onPress={this.btnpic} />
                <MaterialCommunityIcons name="camera-retake" size={26} color='white' style={{ marginBottom: 10, alignSelf: 'flex-end', marginRight: 12 }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back ?
                        Camera.Constants.Type.front : Camera.Constants.Type.back
                    })
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Camera >
      );
    }
    else {
      return (
        <View>
          <Text> Blur </Text>
        </View>
      )
    }
  }

}

export default UploadImage