import React, { Component } from 'react'
import { TouchableOpacity, Text, View, Alert, StyleSheet, AsyncStorage, Animated, Image, Dimensions, Modal, YellowBox, FlatList, ActivityIndicator, Platform } from 'react-native'
import { withNavigationFocus } from 'react-navigation';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import { navigation } from '@react-navigation/native';
import { Root, Popup } from 'popup-ui';
import { DrawerActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Card, ListItem, Button } from 'react-native-elements'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Overlay } from 'react-native-elements';
import { H3, Text as Text2, Container, Header, Left, Icon, Content } from 'native-base';
const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/"
const UrlOfFetch = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/GetImagesByEmail/"
export default class MyUploads extends Component {
  constructor(props) {
    super(props);
    this.state = { imagelist: null, visible: false, alert: false };
  }


  async componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    this._unsubscribeFocus = this.props.navigation.addListener('focus', async (payload) => {
      console.log("focus");
      let user = await AsyncStorage.getItem('currentuser');
      let user2 = await JSON.parse(user);
      let useremail = user2.User_Email;

      this.setState({ st: 'focus' });
      await fetch(UrlOfFetch + useremail + "/").then(
        (resp) => {
          console.log('came here');
          return resp.json();
        }
      ).then(async (data) => {
        if (data.Message == null) {
          this.setState({
            imagelist: data
          }, () => {
            var arr = this.state.imagelist.reverse();
            this.setState({
              imagelist: arr
            });
          });
        }
        else {
          this.setState({ imagelist: 'No', alert: true });
          console.log("MESSAGE :\n" + data.Message);
        }
      });
    })
    this._unsubscribeBlur = this.props.navigation.addListener('blur', (payload) => {
      this.setState({ st: 'blur' })
    });
  }
  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
  }


  render() {
    if (this.state.st == 'focus') {
      if (this.state.imagelist == null) {
        if (Platform.OS === 'ios') {
          return (
            <Container>
              <Header style={{ backgroundColor: 'white' }}>
                <Left style={{ flex: 1 }}>
                  <Button onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.openDrawer())
                  }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                    <Icon name="menu" style={{ color: 'blue', }} />
                  </Button>
                </Left>
              </Header>
              <View style={styles.container}>
                <ActivityIndicator size='large' color='aqua' />
                <Text syle={{ color: 'aqua', fontSize: 24 }}> Fetching Data Please Stand by.</Text>
              </View>
            </Container>
          )
        }
        else {
          return (
            <Container>
              <Header style={{ backgroundColor: 'white' }}>
                <Left style={{ flex: 1 }}>
                  <Button onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.openDrawer())
                  }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                    <Icon name="menu" style={{ color: 'blue', }} />
                  </Button>
                </Left>
              </Header>
              <View style={styles.container}>
                <ActivityIndicator size={70} color='aqua' />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Fetching Data Please Stand by.</Text>
              </View>
            </Container>
          )
        }
      }
      else {
        if (this.state.imagelist != 'No') {
          return (
            <Container>
              <Header style={{ backgroundColor: 'white' }}>
                <Left style={{ flex: 1 }}>
                  <Button onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.openDrawer())
                  }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                    <Icon name="menu" style={{ color: 'blue', }} />
                  </Button>
                </Left>
              </Header>
              <Content>
                <View style={{ marginTop: 30, width, height }}>

                  <ScrollView onScroll={() => {
                    this.props.navigation.setParams('Hide')
                  }}>
                    {
                      this.state.imagelist.map((item, index) => {

                        return (
                          <Card title={'Uploaded On: ' + item.Photo_Date} key={index} >
                            <View key={index} style={{ width: '100%', height: 150 }}>

                              <Image
                                key={index}
                                style={{ width: '100%', height: '80%', resizeMode: 'cover' }}
                                source={{ uri: UrlOfFile + item.Photo_Uri }}
                              />

                              <Text style={{ padding: 6 }}> Status :{item.Photo_Status}</Text>
                            </View>

                          </Card>
                        );
                      })
                    }
                  </ScrollView>


                </View>
              </Content>
            </Container >
          )
        }
        else {
          return (
            <Container>
              <Header style={{ backgroundColor: 'white' }}>
                <Left style={{ flex: 1 }}>
                  <Button onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.openDrawer())
                  }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                    <Icon name="menu" style={{ color: 'blue', }} />
                  </Button>
                </Left>
              </Header>
              <Root>
                <View>
                  <AwesomeAlert
                    show={this.state.alert}
                    showProgress={false}

                    title="Warnning!"
                    message="You don't have any pictures  uploaded, Do You want to take a picture?!"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No, cancel"
                    confirmText="Yes ,Take me there"
                    confirmButtonColor="#AEDEF4"
                    cancelButtonColor='red'
                    onCancelPressed={() => {
                      this.setState({ alert: false })
                    }}
                    onConfirmPressed={() => {
                      this.props.navigation.navigate('UploadPage')
                      this.setState({ alert: false })
                    }}
                  />
                  <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '50%' }} >
                    <H3 style={{ justifyContent: 'center' }}>You did not upload any image yet!.</H3>
                    <Text2 note onPress={() => this.props.navigation.navigate('UploadPage')} style={{ paddingTop: 10 }}>Click here to upload an image!</Text2>
                  </View>
                </View>

              </Root>
            </Container>
          )
        }
      }
    }
    else {
      return (
        <View style={styles.container}>
          <Text> </Text>
        </View>

      )
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  modalstuff: {
    height: 150,
  }
});
const { width } = Dimensions.get("window")
const height = '100%'