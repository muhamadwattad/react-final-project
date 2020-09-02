//React
import React, { Component } from 'react'
import { View, AsyncStorage, BackHandler, StyleSheet, Alert, } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
//Navigator
import { DrawerContentScrollView, DrawerItemList, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import MainPage from './MainPage';
import Profile from './ProfilePage'
import ChatPage from './ChatPage';
import PlayersPage from './PlayersPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagesPage from './ImagesPage'
import Animated from 'react-native-reanimated'
import { Icon, Container, Header, Content, Footer, Button, Right, ListItem, Left, Thumbnail, List, Body, H3, Text, Switch } from 'native-base'
import { createAppContainer } from 'react-navigation';
import SettingsPage from './SettingsPage';
import * as Location from 'expo-location';
import GamesPage from './GamesPage';
import HelpPage from './HelpPage';

const Drawer = createDrawerNavigator();
//Pages

export default class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      color: this.getcolor,
      background: this.getbackground
    }
  }

  render() {

    return (
      <Drawer.Navigator
        //drawerContentOptions={props => <Sidebar {...props} />}
        drawerContent={(props) => <Sidebar {...props} />}
        drawerStyle={{
          width: 240,
          backgroundColor: 'green'
        }}

        overlayColor='white'
        hideStatusBar={false}  >
        <Drawer.Screen name="MainPage" component={MainPage}

          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='home' style={{ fontSize: size, color: color }} />
            ), title: 'Home Page',

          }}



        />
        <Drawer.Screen name="PlayersPage" component={PlayersPage}

          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='account-supervisor' style={{ fontSize: size, color: color }} />
            ),
            title: 'Players'
          }}
        />
        <Drawer.Screen name="Games" component={GamesPage}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='soccer' style={{ fontSize: size, color: color }} />
            ), title: 'Games',
          }}
        />
        <Drawer.Screen name="ChatPage" component={ChatPage}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='chat' style={{ fontSize: size, color: color }} />
            ), title: 'Live Chat', unmountOnBlur: true
          }}
        />
        <Drawer.Screen name="ImagesPage" component={ImagesPage}
          options={{

            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='image' style={{ fontSize: size, color: color }} />
            ), title: 'Images', unmountOnBlur: true
          }}
        />
        <Drawer.Screen name="ProfilePage" component={Profile}

          options={{

            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='account' style={{ fontSize: size, color: color }} />
            ), title: 'Profile',
          }}
        />
        <Drawer.Screen name="SettingsPage" component={SettingsPage}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='settings' style={{ fontSize: size, color: color }} />
            ), title: 'Settings',
          }}
        />
        <Drawer.Screen name="HelpPage" component={HelpPage}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='help' style={{ fontSize: size, color: color }} />
            ), title: 'Help',
          }}
        />
      </Drawer.Navigator >

    )
  }
}

export class Sidebar extends Component {

  constructor(progress, ...props) {
    super(...props);
    this.progress = progress
    this.imgurl = "https://static.thenounproject.com/png/340719-200.png"
    this.state = {
      curTime: new Date().toLocaleTimeString(),
      username: '',
      fulllocation: 'Loading information',
      switch: false,
      background: 'white',
      color: '#131313',
      image: "https://static.thenounproject.com/png/340719-200.png"
    }

  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        curTime: new Date().toLocaleTimeString()
      })
    }, 1000)


  }
  getstuff = async () => {
    let user = await AsyncStorage.getItem('currentuser');
    let user2 = await JSON.parse(user)
    let username = user2.User_Name;
    let image = user2.User_Image;
    const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/"
    if (!image.includes("https://platform-lookaside")) {
      image = UrlOfFile + image;
    }
    this.setState({ image });

    this.setState({
      username
    })
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {

    }
    let location = await Location.getCurrentPositionAsync({});

    if (location) {
      let reverseGC = await Location.reverseGeocodeAsync(location.coords);
      console.log(reverseGC);
      var fulllocation = reverseGC[0].city + "," + reverseGC[0].country;

      //console.log(reverseGC);
      this.setState({
        fulllocation
      })

    } else {
      this.setState({
        fulllocation: 'Failed to get location'
      })

    }

  }
  static statgetstuff=async()=>{
    let user = await AsyncStorage.getItem('currentuser');
    let user2 = await JSON.parse(user)
    let username = user2.User_Name;
    let image = user2.User_Image;
    const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/"
    if (!image.includes("https://platform-lookaside")) {
      image = UrlOfFile + image;
    }
    this.setState({ image });

    this.setState({
      username
    })
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {

    }
    let location = await Location.getCurrentPositionAsync({});

    if (location) {
      let reverseGC = await Location.reverseGeocodeAsync(location.coords);
      console.log(reverseGC);
      var fulllocation = reverseGC[0].city + "," + reverseGC[0].country;

      //console.log(reverseGC);
      this.setState({
        fulllocation
      })

    } else {
      this.setState({
        fulllocation: 'Failed to get location'
      })

    }
  }
  async UNSAFE_componentWillMount() {
    this.getstuff();

  }
  changeswitch = () => {
    let switchh = !this.state.switch;
    if (this.state.background == '#131313') {
      this.setState({ background: 'white' })
    }
    else {
      this.setState({ background: '#131313' })
    }
    if (this.state.color == '#131313') {
      this.setState({ color: 'white' })
    }
    else {
      this.setState({ color: '#131313' })
    }
    this.setState({ switch: switchh })
  }

  render() {
    return (
      < Container style={{ backgroundColor: this.state.background, color: this.state.color }}>
        <Header style={{ backgroundColor: this.state.background, shadowOffset: { height: 0 } }}>
          <Left>

          </Left>
          <Right>
            <Button transparent style={{ backgroundColor: this.state.background }} onPress={() => {
              this.props.navigation.dispatch(DrawerActions.closeDrawer())
            }}>
              <Icon name="menu" style={{ color: 'blue', }} onPress={() => {
              }} />
            </Button>
          </Right>
        </Header>
        <Content >
          <ListItem thumbnail style={{ backgroundColor: this.state.background }}>
            <Left style={{ backgroundColor: this.state.background, color: this.state.color }}>
              <Thumbnail source={{ uri: this.state.image }} style={{ borderBottomWidth: 1 }} ></Thumbnail>
            </Left>
            <Body>
              <H3 style={{ color: this.state.color }}>{this.state.username}</H3>
              <Text note style={{ color: this.state.color }}>{this.state.fulllocation}</Text>
            </Body>
          </ListItem>
          <DrawerContentScrollView {...this.props}   >
            <Animated.View style={{ transform: [{}] }}>
              <DrawerItemList {...this.props} inactiveTintColor={this.state.color} />
            </Animated.View>
          </DrawerContentScrollView>
          
        </Content>
        <Footer style={{ backgroundColor: this.state.background, borderStartWidth: 1 }} >
          <Left>
            <Button transparent style={{ backgroundColor: this.state.background }} onPress={async () => {
              let stayon = await AsyncStorage.getItem('stayon');
              if (stayon == 'false') {
                await AsyncStorage.removeItem('stayon');
                console.log('Removed CurrentUSer Because Stayon is false')
              }
              this.props.navigation.navigate('LoginPage')
            }}>
              <MaterialCommunityIcons name="account-arrow-left" style={{ color: this.state.color, paddingLeft: 15 }} size={30}></MaterialCommunityIcons>
            </Button>
          </Left>

        </Footer>
      </Container >
    )
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
