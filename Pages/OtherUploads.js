import React, { Component } from 'react'
import { RefreshControl, Text, View, Alert, StyleSheet, AsyncStorage, Image, Dimensions, Modal, FlatList, ActivityIndicator, Platform } from 'react-native'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { Card, ListItem } from 'react-native-elements';
import { Button, Icon, Left, Right, Header, Container, Body, Content } from 'native-base'
const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/"
const UrlOfFetch = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/GetOtherimages/"
import { DrawerActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FollowPage from './FollowPage'
import AwesomeAlert from 'react-native-awesome-alerts';
import { ToastAndroid } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class OtherUploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagelist: null,
      openmodal: false,
      newuser: '',
      refresh: false
    };
  }

  getStuff = async () => {
    let user = await AsyncStorage.getItem('currentuser');
    let user2 = await JSON.parse(user)
    let useremail = user2.User_Email;
    console.log(UrlOfFetch + useremail);
    await fetch(UrlOfFetch + useremail + "/").then(
      (resp) => {

        return resp.json();
      }
    ).then(async (data) => {
      if (data.Message == null) {

        var Arr = [];
        for (var i = 0; i < data.length; i++) {
          Arr.push(
            data[i].User_Email);
        }

        var newArr = [];
        newArr = (Arr.filter((item, index) => Arr.indexOf(item) === index));
        var ImageCountURL = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/GetImageCount/";
        var LatestArray = [];
        var GetStuffFromEmail = 'http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/getUserByEmail/'
        for (var i = 0; i < newArr.length; i++) {
          GetStuffFromEmail += newArr[i] + "/"


          await fetch(GetStuffFromEmail).then((resp) => {
            return resp.json();
          }).then(async (data) => {
            var count = 0;
            await fetch(ImageCountURL + data.User_Email + "/").then((rep) => {
              return rep.json();
            }).then((dat) => {
              count = dat;
            });



            if (!data.User_Image.includes("https://platform-lookaside")) {
              data.User_Image = UrlOfFile + data.User_Image;
            }
            data.count = count;
            LatestArray.push(data);
          });
        }
        console.log(LatestArray);



        this.setState({
          imagelist: LatestArray
        }, () => {
          //console.log(this.state.imagelist);
        })

      }
      else {
        this.setState({
          imagelist: 'No'
        })
        console.log("MESSAGE :\n" + data.Message);
      }
    });
    this.setState({ refresh: false });
  }

  async componentDidMount() {
    this._unsubscribeFocus = this.props.navigation.addListener('focus', async (payload) => {
      this.getStuff();
    })
  }

  componentWillUnmount() {
    this._unsubscribeFocus();

  }
  turnvis = () => {

    var x = this.state.visible
    x = !x;
    this.setState({
      visible: x
    })
  }
  setitemstomodal = async (obj) => {
    var x = this.state.visible
    x = !x;
    var status = obj.Photo_Status
    var date = obj.Photo_Date
    var id = obj.Photo_ID
    this.setState({
      visible: x, id, date, status
    })
  }
  render() {
    if (this.state.imagelist == null) {
      if (Platform.OS === 'ios') {
        return (
          <Container>
            <Header style={{ backgroundColor: 'white' }}>
              <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.openDrawer())
                }}>
                  <Icon name="menu" style={{ color: 'blue', }} />
                </Button>
              </Left>
            </Header>

            <View style={styles.container}>
              <ActivityIndicator size='large' color='aqua' />
              <Text style={{ color: 'aqua', fontSize: 24 }}> Fetching Data Please Stand by.</Text>
            </View>
          </Container>
        )
      }
      else {
        return (
          <Container>
            <Header style={{ backgroundColor: 'white' }}>
              <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.openDrawer())
                }}>
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
                <Button transparent onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.openDrawer())
                }}>
                  <Icon name="menu" style={{ color: 'blue', }} />
                </Button>
              </Left>
            </Header>
            <View>
              <Text></Text>
            </View>
            <Modal visible={this.state.openmodal} onRequestClose={() => this.setState({ openmodal: false })}>
            <Header style={{ backgroundColor: 'white' }}>
            <Left style={{ flex: 1 }}>
              <Button onPress={() => {
                this.setState({ openmodal: false })
              }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                <MaterialCommunityIcons name="close" size={30} color='blue' />
              </Button>
            </Left>
          </Header>
              <Content scrollEnabled={false} >
                <FollowPage User={this.state.newuser} />
              </Content>
            </Modal>

            <FlatList
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.imagelist}
              renderItem={({ item, index }) => (
                <ListItem
                  onPress={() => this.setState({ newuser: item.User_Email, openmodal: true }, () => console.log("NEW USER " + this.state.newuser))}
                  key={index}
                  title={item.User_Name}
                  subtitle={"Images Uploaded: " + item.count}
                  leftAvatar={{ source: { uri: item.User_Image } }}
                  bottomDivider
                  chevron
                  topDivider={true}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  titleStyle={{ color: 'black', fontWeight: 'bold' }}
                  subtitleStyle={{ color: 'black' }}
                  chevron={{ color: 'black' }}
                />

              )}
            />

          </Container>
        )
      }
      else {
        return (

          <Container>
           <Header style={{ backgroundColor: 'white' }} >
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }}>
              <Icon name="menu" style={{ color: 'blue', }} />
            </Button>
          </Left>

        </Header>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={this.state.refresh} onRefresh={() => {
                  this.setState({ refresh: true });
                  this.getStuff();
                }}
                />
              }
            >
              <AwesomeAlert />
              <View style={styles.container}>
                <Text style={{ textAlign: 'center', flex: 1, marginTop: '55%',fontSize:22 }}>No one has uploaded an image yet.</Text>

              </View>
            </ScrollView>
          </Container>
        )
      }
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

