import React from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard, AsyncStorage, Modal } from "react-native";
import { RadioButton } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';
import { BackHandler } from 'react-native';
import * as Facebook from 'expo-facebook';
import AwesomeAlert from 'react-native-awesome-alerts';
const url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10"
const TokenUrl = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/UpdateToken/"
const FacebookAppID = "327810618407988";
export default class LoginPage extends React.Component {
  static Popup
  RememberMeCounter = 0
  constructor(props) {
    super(props)

    this.state = {
      checked: 'tt',
      ver: false,
      vis: false,
      url: null,
      username: '',
      password: '',
      failedCount: 0,
      notification: {},
      alert: false,

      alertError: false,
      alertLogging: false

    }
  }
  FaceBookLogin = async () => {

    try {
      await Facebook.initializeAsync(FacebookAppID);
      const {
        type,
        token,

        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=email,name,picture.type(large)`);
        let res = await response.json();
        var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/getUserByEmail/" + res.email + "/"
       
       if(res.email==null||res.email==undefined)
       {
        alert("Unfortunately Could not take the email. Please Edit your privacy Settings.");
         return;
       }
       
        console.log("url is\n"+url);
        this.setState({ ver: true });


        console.log(res);
        await fetch(url).then((resp) => {
          return resp.json();
        }).then(async (data) => {
          if (data.Message == 'No such user exists.') {
            //SIGNUP
            var obj = {
              User_Name: res.name,
              User_Email: res.email,
              User_Password: "noneed",
              User_Location: "undefined",
              User_Token: "undefined",
              User_Image: res.picture.data.url
            };
            //console.log(obj);
            var config = {
              method: 'POST',
              body: JSON.stringify(obj),
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              }
            };
            var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/register/";
            await fetch(url, config).then((resp) => {
              return resp.json();
            }).then((data) => {
              if (data == "Registered Succesfully") {
                this.Succes(res.email);
              }
              else {
                alert("Unfortunately this email is already registerd please try using another signup methods.");
              }
            });
          }
          else {
            //LOGIN
            var LoggedOnUser = data;
            await AsyncStorage.setItem('currentuser', JSON.stringify(LoggedOnUser));
            if (this.state.checked == 'first') {
              await AsyncStorage.setItem('stayon', 'true');
            }
            else {
              await AsyncStorage.setItem('stayon', 'false');
            }
            this.setState({ ver: false }, () => {
              this.props.navigation.navigate('HomePage', { screen: 'MainPage' });
            })



          }
        });









      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  Succes = async (email) => {
    //verifying

    var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/getUserByEmail/" + email + "/";
    await fetch(url).then((resp) => {
      return resp.json();
    }).then(async (data) => {
      var LoggedOnUser = data;
      await AsyncStorage.setItem('currentuser', JSON.stringify(LoggedOnUser));
      if (this.state.checked == 'first') {
        await AsyncStorage.setItem('stayon', 'true');
      }
      else {
        await AsyncStorage.setItem('stayon', 'false');
      }
      this.setState({ ver: false }, () => {
        this.props.navigation.navigate('HomePage', { screen: 'MainPage' });
      })

    });

  }


  onBackButtonPressed() {
    //    BackHandler.exitApp();

    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  ForgotPassword = async () => {
    this.props.navigation.navigate('ForgotPage')
  }
  SignUp = async () => {
    this.props.navigation.navigate('SignupPage')
  }
  _handleNotification = (notification) => {
    this.setState({ notification: notification });
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    try {
      console.log('hello there folks')
      var stayon = await AsyncStorage.getItem('stayon');
      if (stayon == 'true') {
        try {
          let results = await LocalAuthentication.authenticateAsync();
          if (results.success) {
            this.setState({
              modalVisible: false,
              authenticated: true,
              failedCount: 0,
            }, () => {
              this.setState({
                checked: 'tt',
                username: '',

              })
              this.props.navigation.navigate('HomePage', { screen: 'MainPage' })
            });
          }
          else {
            await LocalAuthentication.cancelAuthenticate();
          }

        } catch (e) {
          console.log(e);
        }
      }

    }
    catch (error) {
      alert(error.message)
    }
  }


  Login = async () => {

    this.setState({
      alertLogging: true
    })
    registerForPushNotificationsAsync().then((token) => {
      this.setState({ token }, async () => {


        try {
          var x = await AsyncStorage.getItem('token');

          if (x != this.state.token) {

            await AsyncStorage.setItem('token', this.state.token);
          }

        }
        catch (ex) { }
      });

    })



    Keyboard.dismiss();
    var ur = url + "/Login/" + this.state.username + "/" + this.state.password

    await fetch(ur).then(

      (response) => {

        return response.json()

      }
    ).then
      (
        async (data) => {
          if (data != null) {


            //user does not  exists
            var LoggedOnUser = data
            if (LoggedOnUser.Message != null) {
              //Alert.alert('Error', 'Login Failed.\nPlease put the valid information');
              this.setState({
                alertLogging: false, alertError: true
              })
            }
            //user exists
            else {
              //User has to stay logged in! + use fingerprints ( clicked of remember me)
              await AsyncStorage.removeItem('stayon')

              if (this.state.checked == 'first') {
                await AsyncStorage.setItem('stayon', 'true');
              }
              else {
                await AsyncStorage.setItem('stayon', 'false');
              }
              await AsyncStorage.setItem('currentuser', JSON.stringify(LoggedOnUser));

              var email = LoggedOnUser.User_Email;
              var newurl = TokenUrl + email + "/" + this.state.token + "/"
              console.log("New URL IS :\n" + newurl)

              await fetch(newurl).then((response) => {
                return response.json();
              }).then(
                async (data) => {
                  console.log("Data AFter Token is :\n" + data);
                }
              )
              this.setState({
                checked: 'tt',
                password: ''
              })
              this.setState({
                alertLogging: false
              }, () => {
                this.props.navigation.navigate('HomePage', { screen: 'MainPage' })
              })

            }
          }
          else {
            throw new Error('Something wrong happend')

          }
        }
      ).catch((error) => {
        alert('Something went wrong.');
      })

  }

  render() {
    return (
      <ScrollView style={styles.container} >
        <AwesomeAlert
          show={this.state.alertLogging}
          showProgress={true}

          title="Signing in"

          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          cancelText="No, cancel"
          confirmText="Okay"
          confirmButtonColor="#AEDEF4"
          onCancelPressed={() => {
            this.setState({ alertLogging: false })
          }}
          onConfirmPressed={() => {
            this.setState({ alertLogging: false })

          }}
        />


        <AwesomeAlert
          show={this.state.ver}
          showProgress={true}

          title="Verifying"
          //message="Login completed!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          cancelText="No, cancel"
          confirmText="Okay"
          confirmButtonColor="#AEDEF4"
          onCancelPressed={() => {
            this.setState({ ver: false })
          }}
          onConfirmPressed={() => {
            this.setState({ ver: false })
          }}
        />



        <AwesomeAlert
          show={this.state.alertError}
          showProgress={false}

          title="Login Message"
          message="Login Failed!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Okay"
          confirmButtonColor="red"
          onCancelPressed={() => {
            this.setState({ alertError: false })
          }}
          onConfirmPressed={() => {
            this.setState({ alertError: false }, () => {
              console.log('test')
            })
          }}
        />
        <View>
          <View style={{ marginTop: 0, alignItems: "center", justifyContent: "center" }}>
            <Image source={require("../assets/logoo.png")} />
          </View>
          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={this.FaceBookLogin}>
              <View style={styles.socialButton}>
                <Image source={require("../assets/facebook.png")} style={styles.socialLogo} />
                <Text style={styles.text}>Facebook</Text>
              </View>
            </TouchableOpacity>


          </View>

          <Text style={[styles.text, { color: "#ABB4BD", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>or</Text>

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
          <Text style={styles2.inputTitle}> Password</Text>
          <TextInput
            value={this.state.password}
            placeholder=''
            onChangeText={(password) => {
              this.setState({ password })
            }}
            style={styles2.input}
          />
          <View style={{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }} />
          <View style={{ flexDirection: 'row' }}>

            <RadioButton
              value="first"
              status={this.state.checked === 'first' ? 'checked' : 'unchecked'}
              uncheckedColor='red'
              s
              onPress={() => {
                if (this.RememberMeCounter % 2 == 0) {
                  this.setState({ alert: true })
                }
                this.RememberMeCounter++
                this.setState(
                  { checked: this.state.checked == 'first' ? 'tt' : 'first' });

              }}
              color='green'
            />
            <Text style={[styles.text, styles.link], { paddingTop: 8, color: this.state.checked == 'first' ? 'green' : 'red' }}>Remember me</Text>
          </View>
          <AwesomeAlert
            show={this.state.alert}
            showProgress={false}

            title="Warnning!"
            message="When you enable this button you wont need to enter your information again, We only need your FingerPrints!"
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Okay"
            confirmButtonColor="#AEDEF4"
            onCancelPressed={() => {
              this.setState({ alert: false })
            }}
            onConfirmPressed={() => {
              this.setState({ alert: false })
            }}
          />

          <Text style={[styles.text, styles.link, { textAlign: "right" }]} onPress={this.ForgotPassword}>Forgot Password?</Text>

          <TouchableOpacity style={styles.submitContainer}
            onPress={this.Login}
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
              Login
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                color: "#ABB4BD",
                textAlign: "center",
                marginTop: 24
              }
            ]}
          >
            Don't have an account? <Text style={[styles.text, styles.link]} onPress={this.SignUp}>Sign up </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30, marginTop: 50
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