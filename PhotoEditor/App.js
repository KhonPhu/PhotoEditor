import React, { Component } from 'react'
import { Image, PixelRatio, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Modal, Alert, Button, TextInput } from 'react-native'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'
import { RNPhotoEditor } from 'react-native-photo-editor' //
import RNFS from 'react-native-fs' // native filesystem access
import RNFetchBlob from 'rn-fetch-blob' // transfer data directly from storage
import ImagePicker from 'react-native-image-picker'; //pick image from galle

import photo from './assets/photo.jpg'

type Props = {
    colors?: Array<string>,
    hiddenControls?: Array<string>,
    onCancel?: any => void,
    onDone?: any => void,
    path: string,
    stickers?: Array<string>
}

export default class App extends Component<Props> {

  // Pass the photo to Editor
    _onPress = () => {
        const imageData = this.state.avatarSource;
        const imgPath = imageData.uri.replace('file://', '');
        
        RNPhotoEditor.Edit({
          path: imgPath,

          stickers: [
            'sticker0',
            'sticker1',
            'sticker2',
            'sticker3',
            'sticker4',
            'sticker5',
            'sticker6',
            'sticker7',
            'sticker8',
            'sticker9',
            'sticker10',
          ],
          //hiddenControls: ['clear', 'crop', 'draw', 'save', 'share', 'sticker', 'text'],
          colors: undefined,
          onDone: () => {
            console.log('on done');
          },
          onCancel: () => {
            console.log('on cancel');
          },
        });
    }

    componentDidMount() {
        let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg'
        let binaryFile = resolveAssetSource(photo)

        RNFetchBlob.config({ fileCache: true })
            .fetch('GET', binaryFile.uri)
            .then(resp => {
                RNFS.moveFile(resp.path(), photoPath)
                    .then(() => {
                        console.log('FILE WRITTEN!')
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
            })
            .catch(err => {
                console.log(err.message)
            })
    }

state = {avatarSource: null, username: null, password: null }

constructor(props) {
  super(props);
  this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  
  
  this.state = {  modalVisible: false, username: "", password: "", isValid: false }
  }

  

  //login validation
  onLogin() {
    const { username, password } = this.state;

    fetch('http://10.0.2.2:3001/api/greeter/validate', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(username, password)
    }).then(res => res.json())
      .then((result) => {
        console.log('API Called');
          if (!result.error) {
            this.setState ({modalVisible: false});
            this.setState({ isValid: true});
            console.log(`User : ${username}`);
            
          } else {
            this.setState({ isValid: false })
          }
        },
        (error) => {
          this.setState({ isValid: false });
          console.log(`Error while calling the API : ${error}`)
        }
      );
  }

// Choose the photo to edit
  selectPhotoTapped(visible) {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    this.setState({modalVisible: visible});

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        this.setState({
          avatarSource: source,
        });
      }
    });
  }



    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._onPress}>
                    <View style = {[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                      <Text>EDIT</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {this.selectPhotoTapped(true)}}>
                <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                  <Text>SELECT A PHOTO</Text>
                </View>
                </TouchableOpacity>

                <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} >
                <View style={styles.container}>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Username"
                        underlineColorAndroid='transparent'
                        onChangeText={value => this.setState({ username: value })}/>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={value => this.setState({ password: value })}/>
                  </View>

                  <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onLogin('login')}>
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableHighlight>
                </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    avatarContainer: {
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      borderRadius: 75,
      width: 150,
      height: 150,
    },
    inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
      width:30,
      height:30,
      marginLeft:15,
      justifyContent: 'center'
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
    },
    loginButton: {
      backgroundColor: "#00b5ec",
    },
    loginText: {
      color: 'white',
    },
});
