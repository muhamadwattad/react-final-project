import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, AsyncStorage, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AwesomeAlert from 'react-native-awesome-alerts';
export default class CheckImage extends Component {


  constructor(props) {
    super(props)
    this.state = {
      uri: null,
      uplodedPicUri: 'https://f6h8q2y9.stackpathcdn.com/wp-content/uploads/2018/04/google.jpg',
      test: 'hi',
      alert: false,
      alert1: false,
      alert2: false
    }
    this.uplodedPicPath = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadFiles/";
  }

  choose = async () => {
    let img = this.state.uri;
    let user = await AsyncStorage.getItem('currentuser');
    let user2 = await JSON.parse(user)
    let useremail = user2.User_Email;
    let date = new Date()
    let imgName = useremail + "" + date.getDay() + "" + date.getMonth() + "" + date.getFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + ".jpg";
    this.imageUpload(img, imgName);
  }
  imageUpload = async (imgUri, picName) => {
    this.setState({ alert1: true })
    let urlAPI = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadpicture";
    //let urlAPI = "http://localhost:51935/uploadpicture";
    let dataI = new FormData();
    dataI.append('picture', {
      uri: imgUri,
      name: picName,
      type: 'image/jpg'
    });
    var cont = false;
    const config = {
      method: 'POST',
      body: dataI,
    }
    await fetch(urlAPI, config)
      .then((res) => {
        if (res.status == 201) {
          return res.json();
        }
        else {
          console.log("ERROR1");
          this.setState({ alert1: false, alert2: true, });
          return;
        }
      })
      .then((responseData) => {
        if (responseData != "err") {
          let picNameWOExt = picName.substring(0, picName.indexOf("."));
          let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt),
            responseData.indexOf(".jpg") + 4);
          this.setState({
            uplodedPicUri: { uri: this.uplodedPicPath + imageNameWithGUID },
            imageNameWithGuid: imageNameWithGUID
          }, () => {
            console.log("New URI is :\n" + this.state.uplodedPicUri.uri)
          });

          cont = true;
        }
        else {
          console.log("ERROR2");
          this.setState({ alert1: false, alert2: true, });
          return;
        }//SHOW ERROR MESSSAGE!!
      })
      .catch(err => {
        console.log("ERROR3");
        this.setState({ alert1: false, alert2: true, });
        return;
      }); //SHOW ERROR MESSSAGE!!

    if (cont == true) {
      let user = await AsyncStorage.getItem('currentuser');
      let user2 = await JSON.parse(user);
      let useremail = user2.User_Email;
      let insertimage = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/insertimage/" + this.state.imageNameWithGuid + "/" + useremail + "/";
      await fetch(insertimage).then((resp) => {

        return resp.json();
      }).then((data) => {
        if (data != null) {
          //console.log("Data:\n" + data.Message)
          var ress = data;
          if (ress.Message != null) { // SHOW ERROR MESSSAGE!!{
            console.log("ERROR4");
            this.setState({ alert1: false, alert2: true, });
            return;
          }
          else {
            //console.log('CAME TO POIPUPUP');
            this.setState({ alert: true, alert1: false });
          }
        }
        else {
          console.log("ERROR5");
          this.setState({ alert1: false, alert2: true, });
          return;
        }
      });
    }
    else {
      console.log("ERROR6");
      this.setState({ alert1: false, alert2: true, });
      return;
    }
  }
  async UNSAFE_componentWillMount() {
    if (this.props.route.params != undefined) {
      this.setState({
        uri: this.props.route.params.uri
      })
    }
  }

  render() {
    if (this.state.uri == null) {
      return (
        <View>
          <Text> Checking Image </Text>
        </View>
      )
    }
    else {
      return (



        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }}
          source={{ uri: this.state.uri }}

        >

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 600 }}>

            <MaterialCommunityIcons name="cancel" size={40} color='red' style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.goBack(true)} />
            <MaterialCommunityIcons name="arrow-right-box" size={40} color='green' style={{ paddingRight: 20 }} onPress={this.choose} />
          </View>

          <AwesomeAlert
            show={this.state.alert}
            showProgress={false}

            title="Confirmation message"
            message="Image has been uploaded successfully!"
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
              -
              this.setState({ alert: false, alert1: false, alert2: false }, () => this.props.navigation.navigate('ImagesPage', { screen: 'MyUploads' }))

            }}
          />
          <AwesomeAlert
            show={this.state.alert2}
            showProgress={false}

            title="Error message"
            message="Image wasn't uploaded.Try again later."
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            cancelText="No, cancel"
            confirmText="Okay"
            confirmButtonColor="red"
            onCancelPressed={() => {
              this.setState({ alert2: false })
            }}
            onConfirmPressed={() => {
              this.setState({ alert: false, alert1: false, alert2: false })
            }}
          />

          <AwesomeAlert
            show={this.state.alert1}
            showProgress={true}

            title="Uploading..."
            //message="Uploading Image..."
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={false}
            cancelText="No, cancel"
            confirmText="Okay"
            confirmButtonColor="red"

            onCancelPressed={() => {
              this.setState({ alert1: false, alert2: false, alert: false })
            }}
            onConfirmPressed={() => {
              this.setState({ alert1: false, alert2: false, alert: false })
            }}
          />


        </ImageBackground >


      )
    }
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