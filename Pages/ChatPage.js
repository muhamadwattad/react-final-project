
import React from 'react';
import { View, AsyncStorage, Text,YellowBox } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat'
import Fire from './fire';
import { Button, Icon, Left, Right, Header, Container, Body, Content } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { DrawerActions } from '@react-navigation/native';
type Props = {
  name?: string,
};

export default class ChatPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null
    }



  }

  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });



  get user() {

    // let userx =  AsyncStorage.getItem('currentuser');
    // let user2 =  JSON.parse(userx)
    // let Name = user2.User_Name;
    // console.log('User is :\n' + this.state.user)
    console.log(Fire.shared.uid);
    return {
      name: this.state.username,
      _id: Fire.shared.uid,
    };
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
       textStyle={{
         right:{
           
         },
         left:{
           color:'white'
         }
       }}
        wrapperStyle={{
          right: {
            backgroundColor: '#4863A0'
            ,
            color: 'red'
          }
          ,
          left:{
            backgroundColor:'#4863A0'
          }

        }}
      />
    )
  }

  render = () => {

    return (
      <Container>
          <Header style={{ backgroundColor: 'white' }}>
            <Left style={{ flex: 1 }}>
              <Button onPress={() => {
               this.props.navigation.openDrawer();
              }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                <MaterialCommunityIcons name="menu" size={30} color='blue' />
              </Button>
            </Left>
          </Header>

      <GiftedChat style={{ paddingTop: 6, backgroundColor: 'red' }}
        messages={this.state.messages}
        onSend={Fire.shared.send}
        isLoadingEarlier={true}
        user={this.user}
        isTyping={true}
       
        alwaysShowSend={true}
        minComposerHeight={40}
        minInputToolbarHeight={60}
        renderBubble={this.renderBubble}

        renderUsernameOnMessage={true}
        // showAvatarForEveryMessage={false}
        renderAvatarOnTop={true}
        showUserAvatar={false}
        optionTintColor

      />
      </Container>
    )


  }

  async UNSAFE_componentWillMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    let user = await AsyncStorage.getItem('currentuser');
    let user2 = await JSON.parse(user)
    let Name = user2.User_Name;
    this.setState({ username: Name }, () => {
      console.log('NAME is : ' + this.state.username);
    })

  }
  componentDidMount() {


    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),

      }))
    );



  };



  componentWillUnmount() {
    Fire.shared.off();
  }
}

