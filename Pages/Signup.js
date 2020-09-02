import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard, AsyncStorage } from "react-native";
import { RadioButton } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header, Container, Icon, Left, Button as Btn } from "native-base";
import * as ImagePicker from 'expo-image-picker';
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rptpassword: '',
      profileuri: 'NULL',
      email: '',
      uri: null,
      alert: false,
      alerttitle: '',
      prog: false
    };
    this.uplodedPicPath = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/profilePictures/";
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
          this.setState({ prog: false, alert: true, alerttitle: "Warnning1", alertmessage: "Signed up succefully!\n" + "Saving the image has failed. You can upload the image again later." });

        }
      })
      .catch(err => {
        //SHOW ERROR MESSAGE HERE
        this.setState({ prog: false, alert: true, alerttitle: "Warnning2", alertmessage: "Signed up succefully!\n" + "Saving the image has failed. You can upload the image again later." });
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
            this.setState({ prog: false, alert: true, alerttitle: "Warnning3", alertmessage: "Signed up succefully!\n" + "Saving the image has failed. You can upload the image again later." });

          }
          else {
            this.setState({ prog: false, alert: false, alerttitle: "Sucess", alertmessage: "Signed up succefully!" }, () => {
              this.props.navigation.navigate("LoginPage");
            });

          }
        }
        else {
          //SHOW ERROR
          this.setState({ prog: false, alert: true, alerttitle: "Warnning4", alertmessage: "Signed up succefully!\n" + "Saving the image has failed. You can upload the image again later." });
        }
      }).catch(err => {

        this.setState({ prog: false, alert: true, alerttitle: "Warnning5", alertmessage: "Signed up succefully!\n" + "Saving the image has failed. You can upload the image again later." });
      })
    }



  }

  register = async () => {
    if (!(this.state.username.length >= 4 && this.state.username.length <= 12)) {
      this.setState({ alert: true, alerttitle: "Error", alertmessage: "Username length must be between 4-12." });

      return;
    }
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(this.state.email)) {
      this.setState({ alert: true, alerttitle: "Error", alertmessage: "Email Has to be :\n" + "me@example.com" });
      return;
    }
    if (!(this.state.password.length >= 6 && this.state.password.length <= 14)) {
      this.setState({ alert: true, alerttitle: "Error", alertmessage: "Password length must be between 6-14." });
      return;
    }

    if (this.state.password != this.state.rptpassword) {
      this.setState({ alert: true, alerttitle: "Error", alertmessage: "Passwords has to be the same." });
      return;
    }

    if (this.state.uri == null) {
      this.setState({ alert: true, alerttitle: "Error", alertmessage: "Please add a profile picture." });
      return;
    }

    this.setState({ prog: true });

    var obj = {
      User_Name: this.state.username,
      User_Email: this.state.email,
      User_Password: this.state.password,
      User_Location: "undefined",
      User_Token: "undefined",
      User_Image: ""
    };
    var config = {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };

    var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/register/";
    console.log(config);

    await fetch(url, config).then((resp) => {
      return resp.json();
    }).then((data) => {
      if (data == "Registered Succesfully") {
        //  let imgName = this.state.email + "profile" + ".jpg";
        let date = new Date()
        let imgName = this.state.email + "" + date.getDay() + "" + date.getMonth() + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + ".jpg";
        this.imageUpload(this.state.uri, imgName, this.state.email);
      }
      else {
        this.setState({ prog: false }, () => {
          this.setState({ alert: true, alerttitle: "Error", alertmessage: "Email/Username already exists." });
        });

      }
    });



  };
  render() {
    return (
      <Container>
        <AwesomeAlert
          show={this.state.alert}
          showProgress={false}
          title={this.state.alerttitle}
          message={this.state.alertmessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={false}
          showConfirmButton={true}
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
        <AwesomeAlert
          show={this.state.prog}
          showProgress={true}
          title={'Signing In'}
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
            this.setState({ prog: false })
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
            <Btn transparent onPress={() => this.props.navigation.navigate("LoginPage")}>
              <Icon name="arrow-left" type="FontAwesome5" style={{ fontSize: 24, color: '#08B6CE' }}></Icon>
            </Btn>
          </Left>
        </Header>
        <ScrollView style={styles.container} >

          <View style={{ marginTop: 0, margin: 6 }}>
            <Text style={[styles2.inputTitle]}> Username</Text>
            <TextInput
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

                  <Text style={[styles.text]} >Choose an Image</Text>
                </View>
              </TouchableOpacity>
            </View>





            <TouchableOpacity style={styles.submitContainer}
              onPress={this.register}
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
                Register
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

