import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container, Content, Tabs, Tab, Header, Left, Icon, Button } from 'native-base';
import UpcomingGames from './UpcomingGames'
import PrevGames from './PrevGames'
import { DrawerActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack=createStackNavigator();

export default class GamesPage extends Component {
  render() {
    return (
      <Container >
 
        <Header style={{ backgroundColor: 'white' }}>
          <Left style={{ flex: 1 }}>
            <Button transparent style={{ backgroundColor: 'white' }} onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer())
            }}>
              <Icon name="menu" style={{ color: 'blue', }}  />

            </Button>
          </Left>
        </Header>
        <Content scrollEnabled={true} enableResetScrollToCoords={true}>
          <Tabs style={{}} tabBarPosition='overlayTop' onScroll={()=>{return false}} >
            <Tab  heading="Upcoming Games" activeTextStyle={{ color: 'white' }} tabStyle={{ backgroundColor: 'white' }} textStyle={{color:'black'}}>
              <UpcomingGames />
            </Tab>
            <Tab heading="Previous Games" tabStyle={{ backgroundColor: 'white', }} textStyle={{color:'black'}} activeTextStyle={{ color: 'white' }}>
              <PrevGames />
            </Tab>
          </Tabs>
        </Content>
      </Container>
    )
  }
}

