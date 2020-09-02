import React, { Component } from 'react'
import { Linking, View, StyleSheet, SafeAreaView, Modal, Image, AsyncStorage, RefreshControl, Text, TouchableHighlight, ImageBackground } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Left, Right, Header, Container, Body, Content, Item, Input, Card, CardItem, } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { DrawerActions } from '@react-navigation/native';
import OptionsMenu from "react-native-options-menu";
const mail = "firebasemudaif@gmail.com";
const whatsapp = "+972505554569";
export default class HelpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      subject: ''
    }
  }
  sendmail = async () => {

    Linking.openURL(`mailto:${mail}?subject=${this.state.subject}&body=${this.state.body}`);
  }
  render() {
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
        <Content>

          <Text style={{ color: '#bde5bd', textAlign: 'center', alignSelf: 'center', alignItems: 'center', fontSize: 24, marginTop: 15 }}>Contact Us</Text>

          <Body>

            <Left style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 15 }}>
              <Text style={{ textAlign: 'left', margin: 5, color: '#08B6CE', marginLeft: 15 }}



              >Title</Text>
            </Left>
            <Item regular style={{ marginTop: 10 }}>
              <Input placeholder='Title' style={{ width: 150, paddingTop: 6 }} onChangeText={(text) => {
                this.setState({ subject: text });
              }} />
            </Item>
            <Left style={{ alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 15 }}>
              <Text style={{ textAlign: 'left', margin: 5, color: '#08B6CE', marginLeft: 15 }}>Subject</Text>
            </Left>
            <Item regular style={{ marginTop: 10 }}>
              <Input placeholder='Subject' style={{ width: 150, paddingTop: 6 }} onChangeText={(text) => {
                this.setState({ body: text });
              }} />
            </Item>
          </Body>
          <Button success style={{ marginTop: 25, alignSelf: 'center', width: 100, alignItems: 'center' }} onPress={this.sendmail} >
            <Text style={{ textAlign: 'center', color: 'white', alignSelf: 'center', marginLeft: 28 }}>Submit</Text>
          </Button>


        </Content>
      </Container>
    )
  }
}
