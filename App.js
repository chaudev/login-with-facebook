import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Sizes} from 'react-sizes-baochau';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk-next';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtFacebook: 'Login With Facebook',
      txtLoginFacebook: 'Login With Facebook',
      txtLogoutFacebook: 'Logout',
      loginFBStatus: false,
      nullImage: 'https://bom.to/eoBXYOqMm9zim',
      fbImage: 'https://bom.to/eoBXYOqMm9zim',
      fbName: 'Full Name',
      token: '',
    };
  }

  handleNoti() {
    console.log('Clicked Noti');
  }

  handleLogin() {
    this.LoginWithFacebook();
  }

  LoginWithFacebook() {
    if (this.state.loginFBStatus === false) {
      let that = this;
      LoginManager.logInWithPermissions(['public_profile']).then(
        function (result) {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              console.log('token : ' + data.accessToken.toString());
              that.setState({token: data.accessToken.toString()});
              that.getProfile(data.accessToken.toString());
            });

            console.log('Login success');
            that.setState({loginFBStatus: true});
            that.setState({txtFacebook: that.state.txtLogoutFacebook});
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error);
        },
      );
    } else {
      let token = AccessToken.getCurrentAccessToken();
      if (token[0] === undefined || token[0] === null || token[0] === '') {
        this.setState({loginFBStatus: false});
        this.setState({txtFacebook: this.state.txtLoginFacebook});
        this.setState({fbImage: this.state.nullImage});
        this.setState({fbName: 'Full Name'});
      }
    }
  }

  getProfile = token => {
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture.type(large)&access_token=' +
        token,
    )
      .then(response => {
        response.json().then(json => {
          const ID = json.id;

          const Email = json.email;

          const FullName = json.name;
          this.setState({fbName: FullName});

          const Picture = json.picture.data.url;
          this.setState({fbImage: Picture});
        });
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerX}>
          {/* Button Login With Facebook */}
          <TouchableOpacity
            style={styles.touchSocial}
            onPress={() => {
              this.handleLogin();
            }}>
            <FontAwesome
              name="facebook-official"
              size={Sizes.h56}
              color="#fff"
            />
            <Text style={styles.txtFacebook}>{this.state.txtFacebook}</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'gray',
              paddingRight: Sizes.h20,
            }}>
            <Image source={{uri: this.state.fbImage}} style={styles.imageFB} />
            <Text style={{fontSize: Sizes.h34, fontWeight: 'bold'}}>
              {this.state.fbName}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerX: {
    flex: 1,
    alignItems: 'center',
  },
  txtRunning: {
    fontSize: Sizes.h50,
    fontWeight: 'bold',
  },
  touchNoti: {
    backgroundColor: '#09b83e',
    marginTop: Sizes.h10,
    paddingVertical: Sizes.h30,
    paddingHorizontal: Sizes.h30,
  },
  touchSocial: {
    backgroundColor: '#3b5999',
    marginTop: Sizes.h20,
    paddingVertical: Sizes.h30,
    paddingHorizontal: Sizes.h30,
    marginBottom: Sizes.h20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtFacebook: {
    fontSize: Sizes.h38,
    color: '#fff',
    marginLeft: Sizes.h20,
  },
  imageFB: {
    resizeMode: 'contain',
    width: Sizes.h100 + Sizes.h30,
    height: Sizes.h100 + Sizes.h30,
    marginRight: Sizes.h20,
  },
});
