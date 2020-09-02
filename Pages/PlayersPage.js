import React, { Component } from 'react';
import { Text, View, StyleSheet, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, SearchBar } from 'react-native-elements';
import { WebView } from 'react-native-webview'
import { Button, Icon, Left, Right, Header, Container, Body, Content } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal } from 'react-native';
const TokenAPI = '088efe677d6f473b8e1183deb0570186';
const getPlayersFromAPI = 'https://api.football-data.org/v2/teams/86';
const getPlayerInfoFromAPI = 'http://api.football-data.org/v2/players/';


const obj = {
  method: 'GET',
  headers: {
    'X-Auth-Token': '088efe677d6f473b8e1183deb0570186'
  }
}

export default class PlayersPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      players: null,
      chgSearch: '',
      openmodal: false,
      url: ""
    }
  }
  async UNSAFE_componentWillMount() {


    var x = true
    while (x) {


      await fetch(getPlayersFromAPI, obj).then((response) => {
        return response.json();
      }).then(async (data) => {

        try {
          await AsyncStorage.setItem('playerslist', JSON.stringify(data.squad));
          x = false
        }
        catch (error) {
          alert(error)
        }
      })
    }
    var list = await AsyncStorage.getItem('playerslist');
    var newlist = JSON.parse(list)
    var players = newlist.map(this.getfullname)

    var players2 = players;
    this.setState({ players });
    this.setState({ players2 });



  }
  playerclicked = async (name) => {
    this.setState({ name }, () => {

      if (name == "Marcelo") {
        name += "_Vieira";
      }
      if (name == "Nacho") {
        name += "_Fernández";
      }

      if (name == "Javi") {
        name += "_Hernández"
      }

      var urll = "https://en.wikipedia.org/wiki/" + name;
      this.setState({ url: urll, openmodal: true });
    });



  }
  getfullname(item) {
    return item.name
  }

  render() {
    return (
      <Container>


        <Modal visible={this.state.openmodal}>
          <Header style={{ backgroundColor: 'white' }}>
            <Left style={{ flex: 1 }}>
              <Button onPress={() => {
                this.setState({ openmodal: false, url: "" });
              }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                <MaterialCommunityIcons name="close" size={30} color='blue' />
              </Button>

            </Left>
            <Content>

            </Content>
          </Header>
          <WebView source={{ uri: this.state.url }} />
        </Modal>
        <Header style={{ backgroundColor: 'white' }}>
          <Left style={{ flex: 1 }}>
            <Button onPress={() => {
              this.props.navigation.openDrawer();
            }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
              <MaterialCommunityIcons name="menu" size={30} color='blue' />
            </Button>
          </Left>
        </Header>
        <Content >
          <View style={styles.container}>
          
            <FlatList style={{ marginBottom: 20 }}

              horizontal={false}
              keyExtractor={(item) => item}
              data={this.state.players}
              renderItem={({ item }) => (
                <ListItem
                  key={item}
                  title={item}
                  //subtitle={item.id}
                  //leftAvatar={{ source: { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' } }}
                  onPress={() => this.playerclicked(item)}
                  bottomDivider
                  chevron
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  titleStyle={{ color: 'black', fontWeight: 'bold' }}
                  subtitleStyle={{ color: 'black' }}
                  chevron={{ color: 'black' }}
                />

              )}
            />
          </View>
        </Content>
      </Container>
    )
  }
}



const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',

  },
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: '#fff',
    fontSize: 17,
    color: '#333', borderBottomColor: 'black'
    , borderBottomEndRadius: 1
    ,
    paddingVertical: 20
  }
});
