import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, Modal, Image, AsyncStorage, TouchableHighlight, ImageBackground,Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Left, Right, Header, Container, Body, Content } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const urlOfImages = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/GetImagesByEmail/";
const UrlOfFile = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/uploadfiles/";
import AwesomeAlert from 'react-native-awesome-alerts';
import { ToastAndroid } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class FollowPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      followers: 0,
      following: 0,
      uploaded: 0,
      back: null,
      image: 'https://static.thenounproject.com/png/340719-200.png',
      imagelist: [{
        Photo_ID: 0,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }, {
        Photo_ID: 1,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }, {
        Photo_ID: 2,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }],
      openmodal: false,
      gettingdata: true,
      followstatus: null,
      followingst: '',
      color: '#AEB5BC'
    };
  }

  async UNSAFE_componentWillMount() {


    if (this.props.User != null && this.props.User != null) {
      console.log('came here')
      this.setState({ user: this.props.User }, async () => {
        var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/getUserByEmail/";
        await fetch(url + this.state.user + "/").then((resp) => {
          return resp.json();
        }).then((data) => {
          var newData = data


          this.setState({ user: newData });
        })
        this.GetStuff();
      });
    }
    else if (await this.props.route.params != null) {
      this.setState({ user: this.props.route.params.User }, () => {

        this.GetStuff();
      });
    }

  }

  async GetStuff() {
    var image = this.state.user.User_Image;

    if (!image.includes("https://platform-lookaside")) {
      image = UrlOfFile + image;
    }
    this.setState({ image });



    this.AmIFollowingThem();

    let Email = this.state.user.User_Email;

    let username = this.state.user.User_Name;
    console.log(Email);
    var ImageCountURL = 'http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/GetImageCount/' + Email + "/";
    await fetch(ImageCountURL).then((response) => {
      return response.json();
    }).then(async (data) => {
      // console.log(data);
      this.setState({ uploaded: data });
    });

    var FollowingCountURL = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/howmanyifollow/" + Email + "/";

    await fetch(FollowingCountURL).then((resp) => {
      return resp.json();
    }).then((data) => {
      this.setState({ following: data });
    });
    var FollowersCountURL = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/howmanyfollowme/" + Email + '/';
    await fetch(FollowersCountURL).then((resp) => {
      return resp.json();
    }).then((data) => {
      this.setState({ followers: data });
    });

    var Images;
    await fetch(urlOfImages + Email + "/").then((resp) => {
      return resp.json();
    }).then((data) => {
      Images = data;
    });

    if (Images.Message == "This user didnt upload any picture yet.") {
      var arr = [{
        Photo_ID: 0,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }, {
        Photo_ID: 1,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }, {
        Photo_ID: 2,
        Photo_Date: "Theres No Date!",
        Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
        User_Email: "NO EMAIL",
        Photo_Status: "unchecked"
      }];

      
      this.setState({ imagelist: arr }, () => this.setState({ gettingdata: false }));
    }
    else {
      var len = Images.length;

      if (Images.length < 3) {
        for (var i = 0; i < 3 - len; i++) {
          var newobj = {
            Photo_ID: i,
            Photo_Date: "Theres No Date!",
            Photo_Uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC',
            User_Email: "NO EMAIL",
            Photo_Status: "unchecked"
          };
          await Images.push(newobj);
        }
      }

      this.setState({ imagelist: Images }, () => {
        this.setState({ gettingdata: false });
      });
    }




  }
  showPhoto = async (uri) => {
   
    if(uri=='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC')
    {
      return;
    }
    if (!uri.includes("https://platform-lookaside")) {
      uri = UrlOfFile + uri;
    }
    console.log(uri);
    this.setState({ openmodal: true, newurii: uri });

  }
  Follows = async () => {
    var user = await AsyncStorage.getItem('currentuser');
    var user2 = await JSON.parse(user);
    var currentemail = user2.User_Email;
    var currentname = user2.User_Name;
    var url;
    //this.state.user.User_Email
    if (this.state.followstatus == 'user-following') //UNFOLLOW
    {
      url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/UnFollow/" + currentemail + "/" + this.state.user.User_Email + "/";

      await fetch(url).then((resp) => {
        return resp.json();
      }).then((data) => {
        if (data == 1) {
          this.setState({ followstatus: 'user-follow', st: "Follow", color: 'green' }, () => {
            ToastAndroid.showWithGravity(
              "User was Unfollowed",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
          });
        }
        else {
          ToastAndroid.showWithGravity(
            "Something Went Wrong...",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      });

    }
    else { //FOLLOW
      url = 'http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/Follow/' + currentemail + "/" + this.state.user.User_Email + "/";
      await fetch(url).then((resp) => {
        return resp.json();
      }).then((data) => {
        if (data == 1) {
          this.setState({ followstatus: 'user-following', st: 'Un-Follow', color: 'red' }, () => {

            ToastAndroid.showWithGravity(
              "User was Followed",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );

          });
        }
        else {
          ToastAndroid.showWithGravity(
            "Something Went Wrong...",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
      })
    }
  }

  AmIFollowingThem = async () => {
    var user = await AsyncStorage.getItem('currentuser');
    var user2 = await JSON.parse(user);
    var currentemail = user2.User_Email;
    var currentname = user2.User_Name;
    var url = "http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site10/WhoIFollow/" + currentemail + "/";
    //console.log(url);
    await fetch(url).then((resp) => {
      return resp.json();
    }).then((data) => {
      if (data.Message != null) {

        this.setState({ followstatus: 'user-follow', st: "Follow", color: 'green' });

      }
      else {
        var arr = [];

        for (var i = 0; i < data.length; i++) {
          arr.push(data[i].followname);
        }
        var found = arr.find(el => el == this.state.user.User_Email);
        if (found != undefined) {
          this.setState({ followstatus: 'user-following', st: 'Un-Follow', color: 'red' });


        }
        else {
          this.setState({ followstatus: 'user-follow', st: "Follow", color: 'green' });
        }
      }
    });

  };

  render() {
    return (

      <Container >

        <AwesomeAlert
          show={this.state.gettingdata}
          showProgress={true}

          title="Getting Data"

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
          <Content >
            <ImageBackground source={{ uri: this.state.newurii }} style={{ margin: 6, flex: 1, width: windowWidth, height: windowHeight }} />
          </Content>
        </Modal>
        <Body >
          <View style={{ alignSelf: 'center' }}>
            <View style={styles.profileImage}>
              <Image source={{ uri: this.state.image }} style={styles.image} style={{ width: '100%', height: '100%' }} />
            </View>

          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontWeight: '200', fontSize: 24 }]}>{this.state.user.User_Name}</Text>
            {/* => Button To Follow / Unfollow */}
            <Button transparent style={{alignSelf:'center',alignItems:'center'}} onPress={() => {
              this.Follows();
            }}>
              <Icon type="SimpleLineIcons" name={this.state.followstatus} style={{ color: this.state.color, }} />
            </Button>
            <Text style={[styles.text, { color: this.state.color, fontSize: 14 }]}>{this.state.st}</Text>

          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]}>{this.state.uploaded}</Text>
              <Text style={[styles.text, styles.subText]}>Images Uploaded</Text>
            </View>
            <View style={[styles.statsBox, { borderColor: '#DFD8C8', borderLeftWidth: 1, borderRightWidth: 1 }]} >
              <Text style={[styles.text, { fontSize: 24 }]} onPress={() => {

                if (this.state.followers == 0)
                  ToastAndroid.showWithGravity("No one follows them!", ToastAndroid.SHORT, ToastAndroid.CENTER);

              }}>{this.state.followers}</Text>
              <Text style={[styles.text, styles.subText]}>Followers</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]} onPress={async () => {
                if (this.state.following == 0)
                  ToastAndroid.showWithGravity("They don't follow anyone!", ToastAndroid.SHORT, ToastAndroid.CENTER);

              }}>{this.state.following}</Text>
              <Text style={[styles.text, styles.subText]}>Following</Text>
            </View>
          </View>
          <View style={{ marginTop: 32 }} >
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} >
              {this.state.imagelist.map((item, index) => {
                return (
                  <TouchableHighlight onPress={() => this.showPhoto(item.Photo_Uri)}
                    underlayColor={'white'}
                    key={index.toString()}
                  >
                    <View style={styles.mediaImageContainer} key={index.toString()} >
                      <Image source={{
                        uri:
                          (item.Photo_Uri == 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEXz9Pa5vsq2u8jN0dnV2N/o6u7FydPi5Onw8fS+ws3f4ee6v8v29/jY2+Hu7/Ly9PbJztbQ1dxJagBAAAAC60lEQVR4nO3b2ZaCMBREUQbDJOP//2wbEGVIFCHKTa+zH7uVRVmBBJQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCpdOzvQQqaq2KmuSrOzQ02lSeRem8rpsQq/ozg72Kj4UkAxEev8awnzs7P1yiIadsfpQXjfZCHhUCzbfmeurdNz6bDRsBWRsB+k0cXxdHjpa0wkTBn3hKnjzRZyEgYk3IeEv2RKWCt1cN9EJ0zjfm7Mq/rAVgUnbLpwnK/zA2tnuQmzJHquuqJq91blJuwmAW8rHbV3q2ITFrOAt7Xz3l2UmrBMlpcHe9fOUhOqRYVhFO/cqtSEy0H6bh/tJ1uhCctqlTB/NSnG9pOt1ISXjxLq825laVFowo9GaRPrF9talJqw3n6macaZ09yi1ISG2cLyriwePwxzi1ITru4s2naxma59TC2KTRjE83FqmQ6yeDaUDS3KTRhMV96h5TTSLD4HQ4uCE9bxePUU5pYL/3mD5o9CcMKgTONc39NNLrV5iK4aNLUoOWHQ38RQtW3nsm6db92i8ISvGBtct+hvwqyzBFxE9DehrcHlQPU1YWNvcNGirwlfNThv0ZOE9eJG1OsGZy36kVBdczU9e7RvAz5b9CFhqfIwSp4XwG+OwUWLPiRUV/33Z4tbGtTvGK635CfUDfb/SO5rt20N9t8m65fLT9g3GD5abDY2qC+lvEg4NjhEvLW4tUFvEj4a7OXq3TzoW8Jpg0PEzfk8SThv8EMeJFw1+O8SHmrQg4QHG/Qg4cEGxSc83KD4hIcblJ6w3L508TXh+vtDEpLw3GwDEpKQhOdznVD2fRr9tdpRw/1HqQndIeEvkXCXUlDC+1NBndsnge/fwyVnp9PGH3p95dm1WMKza4/fI37j+UPXR/c+2X9/hjQI0uO3LsyuMioM9A8Sjy/W1iIhY7Sn2tzpUahdWyXiNDNSxcWtSlCBAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCn+AEXGNosxDBhFAAAAAElFTkSuQmCC') ? item.Photo_Uri : UrlOfFile + item.Photo_Uri
                      }}
                        key={index.toString()}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableHighlight>
                );
              })}


            </ScrollView>
          </View>
        </Body>
      </Container >

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    //  fontFamily: 'HelveticaNeue',
    color: '#525750'
  },
  image: {
    flex: 1,
    width: undefined,
    height: '100%'
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden"
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',

  },
  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 32
  },
  statsBox: {
    alignItems: 'center',
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500'
  },
  mediaImageContainer: {
    width: 100,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10
  }

})
