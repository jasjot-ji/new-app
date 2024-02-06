import React, {Component} from 'react';
import {ActivityIndicator, Image, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import productImage from '../../../Assets/images/product.png';
import AIcon from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';
import {baseUrl} from '../../../baseUrl';

let image_options = {
  mediaType: 'photo',
  includeBase64: true,
};

class AddImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      addImageButtonLoading: false,
      proceedButtonLoading: false,
      imageLoading: false,
    };
  }
  componentDidMount() {
    if (this.props.images) {
      this.setState({
        photos: this.props.images,
      });
    }
  }
  render() {
    const openGallery = () => {
      launchImageLibrary(image_options, response => {
        if (response.assets) {
          let photo = response.assets[0];
          if(photo.width === 800 && photo.height === 800){
            var myHeaders = new Headers();
            myHeaders.append('token', this.props.token);
  
            var formdata = new FormData();
            formdata.append('file', {
              uri: photo.uri,
              type: photo.type,
              name: photo.fileName,
            });
  
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow',
            };
  
            fetch(`${baseUrl}/prd_lst/upload_image_prd_lst`, requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(result);
                if (result.status === 'success') {
                  this.props.alert('Image added !', 'success');
                  let x = this.state.photos;
                  x.push(result.url);
                  this.setState({
                    photos: x,
                    addImageButtonLoading: false,
                  });
                } else {
                  this.setState({addImageButtonLoading: false});
                  this.props.alert(result.msg, 'error');
                }
              })
              .catch(error => {
                console.log('error', error);
                this.setState({addImageButtonLoading: false});
              });
          }
          else{
            this.props.alert('Image must be 800x800 pixels !', 'error');
            this.setState({addImageButtonLoading: false});
          }
        } else {
          this.props.alert('Image not selected !', 'error');
          this.setState({addImageButtonLoading: false});
        }
      });
    };

    const openCamera = () => {
      launchCamera(image_options, response => {
        console.log(response);
        this.setState({photo: response.assets[0]});
      });
    };

    const requestCameraPermission = async type => {
      // console.log(type);
      try {
        this.setState({addImageButtonLoading: true});
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (type === 'camera') openCamera();
          else openGallery();
        } else {
          this.setState({addImageButtonLoading: false});
          console.log('Camera permission denied');
        }
      } catch (err) {
        this.setState({addImageButtonLoading: false});
        console.log(err);
      }
    };

    const delImage = img => {
      this.setState({imageLoading: true});
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        url: img,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/del_upload_image_prd_lst`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            let x = [];
            this.state.photos.forEach(photo => {
              if (photo !== img) {
                x.push(photo);
              }
            });
            this.setState({photos: x});
          } else {
            this.props.alert(result.msg, 'error');
          }
          this.setState({imageLoading: false});
        })
        .catch(error => {
          console.log('error', error);
          this.setState({imageLoading: false});
        });
    };
    return (
      <View>
        <Pressable onPress={() => this.props.changeTab('categories')}>
          <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF'}}>Add Product Images</Text>
        </Pressable>
        <Text style={{fontSize: 12, paddingHorizontal: 15, marginVertical: 10}}>Please add only front image of your product. If you want to add multiple images for particular product, you can add it in next step.</Text>
        <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingHorizontal: 15}}>{this.props.path}</Text>
        <ScrollView style={{paddingHorizontal: 20, marginBottom: 300}}>
          <View style={{width: '100%', backgroundColor: '#fefce8', padding: 20, marginVertical: 10, display: 'flex', gap: 10}}>
            <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15}}>
              <AIcon name="exclamationcircleo" size={20} color="#c3a558" />
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, width: '100%', flexShrink: 1}}>Ensure products belong to the selected category</Text>
            </View>
            <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15}}>
              <AIcon name="exclamationcircleo" size={20} color="#c3a558" />
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, width: '100%', flexShrink: 1}}>Adhere to quality check guidelines to prevent issues</Text>
            </View>
            <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15}}>
              <AIcon name="exclamationcircleo" size={20} color="#c3a558" />
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, width: '100%', flexShrink: 1}}>Include 1 to 5 products for a complete catalog</Text>
            </View>
            <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15}}>
              <AIcon name="exclamationcircleo" size={20} color="#c3a558" />
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12, width: '100%', flexShrink: 1}}>Product Image should be 800x800 px</Text>
            </View>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <Image source={{uri: this.props.selectedCategory.category_4_img}} style={{width: 120, height: 120}} />
            <View style={{display: 'flex', gap: 5, width: '100%', flexShrink: 1}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>Product Front Image</Text>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Please provide only the product's front image.</Text>
              <Pressable
                style={{backgroundColor: '#4a93ff', paddingHorizontal: 15, paddingVertical: 10, elevation: 5, borderRadius: 10, margin: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 35}}
                onPress={() => {
                  !this.state.addImageButtonLoading && requestCameraPermission('gallery');
                }}>
                {this.state.addImageButtonLoading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={{fontFamily: 'Roboto-Bold', color: 'white', fontSize: 12, textAlign: 'center'}}>ADD IMAGE</Text>}
              </Pressable>
            </View>
          </View>
          <Pressable
            style={{margin: 10, backgroundColor: '#00b094', paddingHorizontal: 15, paddingVertical: 10, elevation: 5, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40}}
            onPress={() => {
              if (this.state.addImageButtonLoading) {
                this.props.alert('Please wait to upload Image !', 'info');
              } else if (this.state.imageLoading) {
                this.props.alert('Please wait to delete Image !', 'info');
              } else if (!this.state.proceedButtonLoading) {
                this.setState({proceedButtonLoading: true});
                if (this.state.photos.length > 0) {
                  this.props.setImages(this.state.photos);
                  this.props.setCatalogType('new-catalog');
                  this.props.changeTab('productDetails');
                } else {
                  this.props.alert('Please add Images!', 'error');
                }
                setTimeout(() => {
                  this.setState({proceedButtonLoading: false});
                }, 1500);
              }
            }}>
            {this.state.proceedButtonLoading ? <ActivityIndicator size={20} color={'#fff'} /> : <Text style={{fontFamily: 'Roboto-Bold', color: 'white', fontSize: 14, textAlign: 'center'}}>Proceed to Details</Text>}
          </Pressable>
          <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginVertical: 10}}>Products in Catalog : {this.state.photos.length}/5</Text>
          <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, flexDirection: 'row', flexWrap: 'wrap', marginBottom: 50}}>
            {this.state.photos.length > 0 ? (
              this.state.photos.map(img => (
                <Pressable onPress={() => delImage(img)} style={{width: 80, height: 80, position: 'relative'}} key={img}>
                  <Image source={{uri: img}} style={{width: 80, height: 80}} />
                  {!this.state.imageLoading && <AIcon name="close" size={20} color="#ff0000" style={{position: 'absolute', top: 10, right: 10, backgroundColor: 'white', borderRadius: 20}} />}
                  {this.state.imageLoading && (
                    <View style={{width: 80, height: 80, backgroundColor: '#00000060', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <ActivityIndicator color={'#ffffff'} size={20} />
                    </View>
                  )}
                </Pressable>
              ))
            ) : (
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>No images provided.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    color: 'black',
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Regular',
    elevation: 5,
    width: '100%',
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(AddImages);
