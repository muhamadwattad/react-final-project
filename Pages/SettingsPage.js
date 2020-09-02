import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard, AsyncStorage } from "react-native";
import { Header, Container, Icon, Left, Button as Btn } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Sidebar } from './HomePage'
export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      imageurl: '',
      rptpassword: '',
      edit: true,
      uri: null,
      alert: false
    };

  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, quality: 0.7

      //aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ uri: result.uri });
    }
  }
  imageUpload = async (imgUri, picName, userEmail) => {
    let urlAPI = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadpicture/";
    let dataI = new FormData();
    dataI.append('picture', {
      uri: imgUri,
      name: picName,
      type: 'image/jpg'
    });
    const config = {
      method: 'POST',
      body: dataI,
    }
    var cont = false;
    await fetch(urlAPI, config)
      .then((res) => {
        if (res.status == 201) { return res.json(); }
        else { return "err"; }
      })
      .then((responseData) => {
        if (responseData != "err") {
          let picNameWOExt = picName.substring(0, picName.indexOf("."));
          let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
            responseData.indexOf(".jpg") + 4);
          this.setState({
            uplodedPicUri: { uri: this.uplodedPicPath + imageNameWithGUID },
            imageNameWithGuid: imageNameWithGUID
          }, () => console.log(this.state.imageNameWithGuid));

          cont = true;
        }
        else { //SHOW ERROR MESSAGE HERE!
          Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);

        }
      })
      .catch(err => {
        //SHOW ERROR MESSAGE HERE
        Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);
      });

    if (cont == true) {

      let insertimage = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/InsertProfilePicture/" + this.state.imageNameWithGuid + "/" + userEmail + "/";
      console.log(insertimage);
      await fetch(insertimage).then((resp) => {

        return resp.json();
      }).then((data) => {
        if (data != null) {
          //console.log("Data:\n" + data.Message)
          var ress = data;
          if (ress.Message != null) { // SHOW ERROR MESSSAGE!!{
            Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);

          }
          else {
            Toast.showWithGravity("Image Uploaded!", Toast.SHORT, Toast.BOTTOM);
          }
        }
        else {
          Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);

        }
      }).catch(err => {
        Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);

      });
    }



  };

  getstuff = async () => {
    var user = await AsyncStorage.getItem('currentuser');
    var CurrentUser = await JSON.parse(user);

    if (CurrentUser.User_Password == "noneed") {
      this.setState({ edit: false });
      this.setState({ email: CurrentUser.User_Email, username: CurrentUser.User_Name });
      this.setState({ password: "You came from Facebook, you cant change password " });
      this.setState({ rptpassword: "You came from Facebook, you cant change password " });
    }
    else {
      this.setState({ edit: true });
      this.setState({ password: CurrentUser.User_Password });
      this.setState({ rptpassword: CurrentUser.User_Password });
    }
    this.setState({ email: CurrentUser.User_Email, username: CurrentUser.User_Name });
  }
  componentDidMount() {
    this._unsubscribeFocus = this.props.navigation.addListener('focus', async (payload) => {
      this.getstuff();
    });
    this._unsubscribeBlur = this.props.navigation.addListener('blur', (payload) => {
      this.setState({ st: 'blur' })
    });
  }
  componentWillUnmount() {
    this._unsubscribeFocus();
    this._unsubscribeBlur();
    this.camera = null;
  }

  save = async () => {
    if (this.state.edit == false) {
      Toast.showWithGravity("You cant update because you are a facebook user.", Toast.SHORT, Toast.BOTTOM);
      return;
    }

    this.setState({ alert: true });
    var user = await AsyncStorage.getItem('currentuser');
    var CurrentUser = await JSON.parse(user);
    var Cont = false;
    if (this.state.username != CurrentUser.User_Name) {

      if (!(this.state.username.length >= 4 && this.state.username.length <= 12)) {
        Toast.showWithGravity("Username length must be between 4-12", Toast.SHORT, Toast.BOTTOM);
        this.setState({ alert: false })
        return;
      }


      this.setState({ alert: true });
      var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/UpdateName/" + this.state.username + "/" + CurrentUser.User_Email + "/";
      await fetch(url).then((resp) => {
        return resp.json()
      }).then((data) => {
        if (data == 1) {
          Toast.showWithGravity("Username has been updated successfully!", Toast.SHORT, Toast.BOTTOM);
          Cont = true;

        }
        else {
          Toast.showWithGravity("Username already in use.", Toast.SHORT, Toast.BOTTOM);
        }
      });
    }
    if (this.state.password != CurrentUser.User_Password) {


      if (this.state.password != this.state.rptpassword) {
        Toast.showWithGravity("Passwords has to be the same.", Toast.SHORT, Toast.BOTTOM);
        this.setState({ alert: false });
        return;
      }
      else {
        if (!(this.state.password.length >= 6 && this.state.password.length <= 14)) {
          Toast.showWithGravity("Passwords has to be between 6-14.", Toast.SHORT, Toast.BOTTOM);
          this.setState({ alert: false });
          return;
        }


        this.setState({ alert: true });
        var urll = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/UpdatePassword/" + this.state.password + "/" + CurrentUser.User_Email + "/";
        await fetch(urll).then((resp) => {
          return resp.json();
        }).then((data) => {
          if (data == 1) {
            Toast.showWithGravity("Password has been updated successfully!", Toast.SHORT, Toast.BOTTOM);
            Cont = true;
          }
          else {
            Toast.showWithGravity("Something went wrong.", Toast.SHORT, Toast.BOTTOM);
          }
        })
      }
    }

    if (this.state.uri != null) {
      this.setState({ alert: true });
      Cont = true;
      let date = new Date()
      let imgName = this.state.email + "" + date.getDay() + "" + date.getMonth() + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + ".jpg";
      await this.imageUpload(this.state.uri, imgName, this.state.email);

    }

    var ur = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/getUserByEmail/" + this.state.email + "/";

    if (Cont == true) {

      await fetch(ur).then((resp) => {
        return resp.json();
      }).then(async (data) => {
        var CurrUser = data;
        await AsyncStorage.setItem('currentuser', JSON.stringify(CurrUser));

      });

    }
    else {
      Toast.showWithGravity("Nothing to update.", Toast.SHORT, Toast.BOTTOM);
    }

    this.setState({ alert: false });

  };

  render() {
    return (

      <Container>
        <AwesomeAlert
          show={this.state.alert}
          showProgress={true}
          title={"Updating..."}
          // message={this.state.alertmessage}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          cancelText="No, cancel"
          confirmText="Confirm"
          confirmButtonColor="red"
          useNativeDriver={true}
          onDismiss={() => {
            this.setState({ alert: false })
          }}
          onCancelPressed={() => {
            this.setState({ alert: false })
          }}
          onConfirmPressed={() => {
            this.setState({ alert: false })

          }}

        />
        <Header style={{ backgroundColor: '#fff' }}>

          <Left style={{ flex: 1, marginLeft: 5 }}>
            <Btn transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon name="menu" style={{ fontSize: 24, color: '#08B6CE' }}></Icon>
            </Btn>
          </Left>
        </Header>
        <ScrollView style={styles.container} >

          <View style={{ marginTop: 0, margin: 6 }}>
            <Text style={[styles2.inputTitle]}> Username</Text>
            <TextInput
              editable={this.state.edit}
              value={this.state.username}
              placeholder=""
              onChangeText={(username) => {
                this.setState({ username })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Email</Text>
            <TextInput
              editable={false}
              value={this.state.email}
              placeholder=""
              onChangeText={(email) => {
                this.setState({ email })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />

            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Password</Text>
            <TextInput
              editable={this.state.edit}
              value={this.state.password}
              placeholder=''
              onChangeText={(password) => {
                this.setState({ password })
              }}
              style={[styles2.input,]}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
            <Text style={[styles2.inputTitle, { marginTop: 4 }]}> Repeat Password</Text>
            <TextInput

              editable={this.state.edit}
              value={this.state.rptpassword}
              placeholder=""
              onChangeText={(rptpassword) => {
                this.setState({ rptpassword })
              }}
              style={styles2.input}
            />
            <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />

            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => this.pickImage()}>
                <View style={styles.socialButton}>

                  <Text style={[styles.text]} >Update Profile Image</Text>
                </View>
              </TouchableOpacity>
            </View>





            <TouchableOpacity style={styles.submitContainer}
              onPress={this.save}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: "#FFF",
                    fontWeight: "600",
                    fontSize: 16
                  }
                ]}
              >
                Save
            </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30, marginTop: 55
  },
  text: {
    // fontFamily: "Avenir Next",
    color: "#1D2029"
  },
  socialButton: {
    flexDirection: "row",
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(171, 180, 189, 0.65)",
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(171, 180, 189, 0.35)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5
  },
  socialLogo: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  link: {
    color: "#08B6CE",
    fontSize: 14,
    fontWeight: "500"
  },
  submitContainer: {
    backgroundColor: "#08B6CE",
    fontSize: 16,
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5
  }
});

const styles2 = StyleSheet.create({
  inputTitle: {
    color: "#08B6CE",
    fontSize: 14,

  },
  input: {
    paddingVertical: 12,
    color: "black",
    fontSize: 14,
    //  fontFamily: "Avenir Next"
  }
});
