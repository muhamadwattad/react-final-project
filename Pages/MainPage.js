import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Alert, AsyncStorage } from 'react-native'
import { Container, Left, Header, Button, Icon, Content } from 'native-base';
import { DrawerActions } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default class MainPage extends Component {

  constructor(props) {
    super(props)
  }


  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }}>
          <Left style={{ flex: 1 }}>
            <Button transparent style={{ backgroundColor: 'white' }} onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }}>
              <Icon name="menu" style={{ color: 'blue', }} onPress={() => {
              }} />
            </Button>
          </Left>
        </Header>
        <Content style={{flex:1}}>
          <WebView source={{ uri:"https://www.realmadrid.com/en"}} style={{height:800,width:'100%'}}/>
        </Content>
      </Container>

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