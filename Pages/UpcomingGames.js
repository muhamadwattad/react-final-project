import React, { Component } from 'react'
import { Text, View, Image, Picker, StyleSheet, Modal,Linking } from 'react-native';

import { Container, Content, Tabs, Tab, Header, Left, Icon, Button, Body, Right } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

const GamesFromTo = 'http://api.football-data.org/v2/teams/86/matches?';
const TokenAPI = '088efe677d6f473b8e1183deb0570186';
const getPlayersFromAPI = 'https://api.football-data.org/v2/teams/86';
const getPlayerInfoFromAPI = 'http://api.football-data.org/v2/players/';
const obj = {
  method: 'GET',
  headers: {
    'X-Auth-Token': '088efe677d6f473b8e1183deb0570186'
  }
}
class GameModel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text>
          {this.props.gamedata.homeTeam.name}
        </Text>
      </View>

    )
  }
}
export default class UpcomingGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 4,
      returned: [],
      openmodal: false,
      gamedata: null,
      alert:false,
      errortext:null
    }
  }
  openweb=async()=>{
    var date = this.state.gamedata.utcDate.split('T')[0];

    var url = "https://www.google.com/search?q=" + this.state.gamedata.homeTeam.name + " VS " + this.state.gamedata.awayTeam.name + " " + date;
    url = url.replace(/ /g, "%20");
    var sup = await Linking.canOpenURL(url);
    if (sup) {
      await Linking.openURL(url);
    }
    else {
      alert("Could not find an option to open the link with.");
    }
  }
  async UNSAFE_componentWillMount() {
    this.getInfo();
  }
  getInfo = async () => {
    var Url = "http://api.football-data.org/v2/teams/86/matches?limit=5&status=SCHEDULED"

    var toBeReturned = [];
    console.log("The Url is :\n" + Url);
    await fetch(Url, obj).then((response) => {
      return response.json();
    }).then(async (data) => {

      if (data.count == 0) {
        this.setState({ returned: [], alert: true });


      }
      else {
        this.setState({errortext:"TEXT"})
        var newData = data.matches;
        console.log(newData);
        for (var i = 0; i < newData.length; i++) {
          var obj = {
            homeTeam: newData[i].homeTeam.name,
            awayTeam: newData[i].awayTeam.name,
            homeScore: newData[i].score.fullTime.homeTeam,
            awayScore: newData[i].score.fullTime.awayTeam,
            matchday: newData[i].matchday == null ? newData[i].stage : newData[i].matchday,
            fulldata: newData[i]
          }
          toBeReturned.push(obj);

        }


        this.setState({ returned: toBeReturned });
      }
    });
  }
  render() {

    return (

      <Container  >

        <AwesomeAlert
          show={this.state.alert}
          showProgress={false}

          title="Error"
          message="No Upcoming matches have been scheduled!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="Okay"
          confirmButtonColor="red"
    
          onConfirmPressed={() => {
            this.setState({ alert: false })
          }}
        />


        <Content scrollEnabled={false} enableResetScrollToCoords={false}>
          <View style={{ alignContent: 'center', alignItems: 'center' }}>

          </View>
          <Content scrollEnabled={true} disableKBDismissScroll={true} enableResetScrollToCoords={true} style={{ flex: 1, height: '100%' }}>
            <Modal visible={this.state.openmodal} animationType='slide' >
              <Header style={{ backgroundColor: 'white' }}>
                <Left style={{ flex: 1 }}>
                  <Button onPress={() => {
                    this.setState({ openmodal: false })
                  }} style={{ backgroundColor: 'white', color: 'blue' }} transparent >
                    <MaterialCommunityIcons name="close" size={30} color='blue' />
                  </Button>
                </Left>
              </Header>
              <Content >
                <GameModel gamedata={this.state.gamedata} />
              </Content>
            </Modal>

            {

              this.state.returned.map((item, index) => {
                var home = item.awayScore <= item.homeScore ? 'black' : 'grey';
                var away = item.awayScore >= item.homeScore ? 'black' : 'grey';
                return (

                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'grey', borderBottomWidth: 1 }}>
                    <Left>
                      <Image source={{ uri: 'https://static.thenounproject.com/png/340719-200.png' }} style={{ width: 72, height: 72 }} />

                      <Text style={{ marginLeft: 15, color: home, fontWeight: 'bold', width: 100 }}>{item.homeTeam}</Text>

                    </Left>

                    <View style={{}}>
                      <Text style={{ fontWeight: 'bold' }}>{item.fulldata.competition.name} Game Day: {item.matchday}</Text>
                      <Text style={{ textAlign: 'center', marginTop: 15 }}>{item.homeScore} - {item.awayScore}</Text>
                      <Text style={{
                        textAlign: 'center', marginTop: 42, color: '#08B6CE', fontSize: 14,
                        fontWeight: "500", marginRight: 1
                      }} onPress={() => {
                        this.setState({  gamedata: item.fulldata },()=>this.openweb());
                      }}>View Match Data</Text>
                    </View>
                    <Right>
                      <Image source={{ uri: 'https://static.thenounproject.com/png/340719-200.png' }} style={{ width: 70, height: 70 }} />


                      <Text style={{ marginRight: -4, color: away, fontWeight: 'bold', width: 120 }}>{item.awayTeam}</Text>



                    </Right>
                  </View>
                )
              })
              
            }
            {this.state.errortext==null?<Text style={[styles.container,{marginTop:'50%',textAlign:'center',fontSize:24}]}>No Matches have been scheduled.</Text>:<Text></Text>}
          </Content>

        </Content>
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
