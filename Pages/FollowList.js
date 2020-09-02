import React, { Component } from 'react'
import { Text, View, StyleSheet, Modal } from 'react-native'
import { Button, Icon, Left, Right, Header, Container, Body, Content } from 'native-base'
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, SearchBar } from 'react-native-elements';
import FollowPage from './FollowPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/"
export default class FollowList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: null,
      status: null,
      openmodal: false
    }
  }
  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
    this.camera = null;
  }
  async componentDidMount() {

    this._unsubscribeFocus = this.props.navigation.addListener('focus', async (payload) => {
      if (await this.props.route.params.List != null) {
        this.setState({ list: this.props.route.params.List });
      }
      if (await this.props.route.params.Status != null) {
        this.setState({ status: this.props.route.params.Status });
      }
      this.setState({ st: 'focus' });
    });
    this._unsubscribeBlur = this.props.navigation.addListener('blur', (payload) => {
      this.setState({ st: 'blur' });
    });
  }

  render() {
    return (
      <View style={styles.container}>
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
          data={this.state.list}
          renderItem={({ item, index }) => (
            <ListItem
              onPress={() => this.setState({ newuser: item.User_Email, openmodal: true })}
              key={index}
              title={item.User_Name}
              subtitle={this.state.status + " " + item.followdate}
              leftAvatar={{ source: {   uri: item.User_Image.includes("https://platform-lookaside")?item.User_Image:UrlOfFile+item.User_Image } }}
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
      </View>
    )
  }

}
const styles = StyleSheet.create({
  container: {

    backgroundColor: '#fff',
    paddingTop: 25
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
