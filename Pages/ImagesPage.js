import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import UploadImage from './UploadImage'
import MyUploads from './MyUploads'
import OtherUploads from './OtherUploads'
const Tab = createMaterialBottomTabNavigator()

export default class ImagesPage extends Component {
  constructor(props) {
    super(props)
    this.state={ display: 'none' } 
  }

  render() {
    return (

      <Tab.Navigator
        activeColor="black"
        inactiveColor='grey'
        options={{
          unmountOnBlur: true,
        }
        }
        keyboardHidesNavigationBar={true}
        barStyle={{ backgroundColor: 'gold'}}
      >
        <Tab.Screen

          name="MyUploads"
          component={MyUploads}
          lazy={false}
sce
          options={{

            tabBarLabel: 'My Uploads',
            tabBarColor: 'red',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="tooltip-image-outline" color={color} size={26} />
            ),

          }}
        />
        <Tab.Screen
          lazy={false}
          name="UploadPage"
          component={UploadImage}

          options={{

            tabBarLabel: 'Upload Image',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="camera" color={color} size={26} />
            ),

          }}
        />
        <Tab.Screen
          lazy={false}
          name="OtherUploads"
          component={OtherUploads}
          options={{
            tabBarLabel: 'Other Uploads',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="folder-multiple-image" color={color} size={26} />
            ),
          }}
        />

      </Tab.Navigator>
    );


  }
}
