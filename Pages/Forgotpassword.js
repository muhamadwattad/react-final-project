import React, { Component } from 'react'
import { Linking, View, StyleSheet, SafeAreaView, Modal, Image, AsyncStorage, RefreshControl, Text, TouchableHighlight, ImageBackground } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Left, Right, Header, Container, Body, Content, Item, Input, Card, CardItem, } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { DrawerActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import OptionsMenu from "react-native-options-menu";
import AwesomeAlert from 'react-native-awesome-alerts';
const url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/Forgotpassword/";
export default class Forgotpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      alert:false
    }
  }
  sendmail = async () => {
    this.setState({alert:true})
    await fetch(url + this.state.email + "/").then((resp) => {
      return resp.json();
    }).then((data) => {
      if (data == 1) {
        Toast.showWithGravity('Email was sent to you', Toast.SHORT, Toast.BOTTOM);
        this.setState({alert:false})
      }
      else {
        Toast.showWithGravity('Something Went wrong', Toast.SHORT, Toast.BOTTOM);
        this.setState({alert:false})
      }

    });
  }
  render() {
    return (
      <Content>
        <AwesomeAlert
          show={this.state.alert}
          showProgress={true}

          title="Loading..."
         // message="No games have been played last month. Check the last 5 matches."
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          confirmText="Okay"
          confirmButtonColor="red"

          onConfirmPressed={() => {
            this.setState({ alert: false })
          }}
        />

        <Text style={{ color: '#bde5bd', textAlign: 'center', alignSelf: 'center', alignItems: 'center', fontSize: 24, marginTop: 15 }}>Reset Password</Text>

        <Body>

          <Left style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 15 }}>
            <Text style={{ textAlign: 'left', margin: 5, color: '#08B6CE', marginLeft: 15 }}



            >Email</Text>
          </Left>
          <Item regular style={{ marginTop: 10 }}>
            <Input placeholder='Email' style={{ width: 150, paddingTop: 6 }} onChangeText={(text) => {
              this.setState({ email: text });
            }} />
          </Item>

        </Body>
        <Button success style={{ marginTop: 25, alignSelf: 'center', width: 100, alignItems: 'center' }} onPress={this.sendmail} >
          <Text style={{ textAlign: 'center', color: 'white', alignSelf: 'center', marginLeft: 28 }}>Submit</Text>
        </Button>


      </Content>
    )
  }
}
