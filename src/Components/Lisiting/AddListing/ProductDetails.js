import React, {Component} from 'react';
import {ActivityIndicator, Image, PermissionsAndroid, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import productImage from '../../../Assets/images/product.png';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import {connect} from 'react-redux';
import {baseUrl} from '../../../baseUrl';
let image_options = {
  mediaType: 'photo',
  includeBase64: true,
};
const GetFormInput = ({id, name, identifier, type, required, description, placeholder, options, value, changeValue}) => {
  if (type === 'text') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={1} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} style={styles.input} placeholder={placeholder} />
        {/* <div className="position-absolute bottom-100 tooltip-text">{description}</div> */}
      </View>
    );
  } else if (type === 'select') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <View style={styles.pickerBox}>
          <Picker name={identifier} id={id} itemStyle={styles.picker} mode="dropdown" selectedValue={value} onValueChange={e => changeValue(e)}>
            <Picker.Item label="Select" value="" />
            {options?.map(value => (
              <Picker.Item label={value} value={value} key={value} />
            ))}
          </Picker>
        </View>
      </View>
    );
  } else if (type === 'number') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={1} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} style={styles.input} placeholder={placeholder} keyboardType="numeric" />
      </View>
    );
  } else if (type === 'textarea') {
    return (
      <View style={styles.inputBox}>
        <Text style={styles.label}>{name}</Text>
        <TextInput numberOfLines={5} style={[styles.input, {textAlignVertical: 'top'}]} placeholder={placeholder} name={identifier} id={id} value={value} onChangeText={e => changeValue(e)} />
      </View>
    );
  } else {
    return <Text>...</Text>;
  }
};
const GetTableFormInput = ({id, name, identifier, type, required, description, placeholder, options, value, changeValue}) => {
  if (type === 'text') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} />
        </View>
      </View>
    );
  } else if (type === 'select') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <View style={styles.tablePickerBox}>
            <Picker itemStyle={styles.picker} mode="modal" selectedValue={value} onValueChange={e => changeValue(e)}>
              <Picker.Item label="Select" value="" />
              {options?.map(value => (
                <Picker.Item label={value} value={value} key={value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  } else if (type === 'number') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} keyboardType="numeric" />
        </View>
      </View>
    );
  } else {
    return <Text>...</Text>;
  }
};

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      showSizeOptions: false,
      selectedVariations: [],
      selectedFullVariations: [],
      variationsData: [],
      product_data: [],
      selectedForm: 0,
      catalog_data: null,
      addImageButtonLoading: false,
      imageLoading: false,
    };
  }
  componentDidMount() {
    console.log(this.props.catalogType);
    if (this.props.catalogType === 'edit-draft') {
      console.log(this.props.selectedCatalog);
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/fetch_single_catalog/${this.props.selectedCatalog}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            var myHeaders = new Headers();
            myHeaders.append('token', this.props.token);
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify({
              category_4_id: result.product_data[0].category_4_id,
            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            };

            fetch(`${baseUrl}/prd_lst/fetchProductlistform`, requestOptions)
              .then(response => response.json())
              .then(res => {
                console.log(res);
                if (res.status === 'success') {
                  this.setState({formData: res, catalog_data: result.product_data});
                }
              })
              .catch(error => console.log('error', error));
          }
        })
        .catch(error => console.log('error', error));
    } else {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        category_4_id: this.props.selectedCategory.category_4_id,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/fetchProductlistform`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.setState({formData: result});
          }
        })
        .catch(error => console.log('error', error));
    }
  }
  componentDidUpdate() {
    console.log(this.state);
    if (this.state.formData && this.state.product_data.length === 0) {
      if (this.props.catalogType === 'new-catalog') {
        let arr = [];
        console.log(this.props.selectedImages);
        this.props.selectedImages.forEach(img => {
          let prdct_details_fields = [];
          let prdct_size_invt_fields = {};
          let prdct_other_fields = [];
          this.state.formData.productdetailfields.forEach(pd => {
            let field = {
              name: pd.product_details_field.name,
              identifier: pd.product_details_field.identifier,
              value: '',
            };
            prdct_details_fields = [...prdct_details_fields, Object.assign({}, field)];
          });
          this.state.formData.productsizeinvtfields.forEach(pd => {
            prdct_size_invt_fields[pd.identifier] = '';
          });
          this.state.formData.productotherfields.forEach(pd => {
            let field = {
              name: pd.product_other_field.name,
              identifier: pd.product_other_field.identifier,
              value: '',
            };
            prdct_other_fields = [...prdct_other_fields, Object.assign({}, field)];
          });
          let product = {
            category_4_id: this.state.formData.category_data.category_4_id,
            type: 'submit',
            products_data: {
              productdetailfields: [...prdct_details_fields],
              productsizeinvtfields: prdct_size_invt_fields,
              product_variations: [],
              productotherfields: [...prdct_other_fields],
              image_data: {
                front_image_url: img,
                other_images: [],
              },
            },
          };
          arr = [...arr, Object.assign({}, product)];
        });
        this.setState({product_data: arr});
      } else {
        let arr = [];
        this.state.catalog_data.forEach(catalog => {
          let vars = [];
          catalog.product_variants.map(variant => {
            let pv = {
              inventory: `${variant.seller_products_variants[0].inventory}`,
              product_mrp: `${variant.product_mrp}`,
              seller_price: `${variant.seller_products_variants[0].price}`,
              supplier_sku_id: variant.seller_products_variants[0].supplier_sku_id,
              variation_attributes: variant.seller_products_variants[0].variation_attributes_attri,
              variation_name: variant.variation_name,
              variation_name_sku: variant.variation_name_sku,
              variation_value: variant.variation_value,
              variation_value_sku: variant.variation_value_sku,
            };
            vars.push(pv);
          });
          let product = {
            category_4_id: this.state.formData.category_data.category_4_id,
            type: 'submit',
            products_data: {
              productdetailfields: catalog.product_details_attr,
              productsizeinvtfields: {
                comment: catalog.product_description_n,
                supplier_product_id: catalog.product_variants[0].seller_products_variants[0].seller_product.supplier_product_id,
                product_weight_in_gms: `${catalog.product_weight_in_gms}`,
                product_name: catalog.product_name_n,
              },
              product_variations: [...vars],
              productotherfields: catalog.other_details_attri,
              image_data: {
                front_image_url: catalog.products_images[0].url,
                other_images: [],
              },
            },
          };
          arr = [...arr, Object.assign({}, product)];
        });
        this.setState({product_data: arr});
      }
    }
  }
  render() {
    const openGallery = () => {
      launchImageLibrary(image_options, response => {
        if (response.assets) {
          let photo = response.assets[0];
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
                let pd = [...this.state.product_data];
                let x = [...pd[this.state.selectedForm]?.products_data?.image_data?.other_images];
                x.push(result.url);
                pd[this.state.selectedForm].products_data.image_data.other_images = x;
                this.setState({
                  product_data: pd,
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
            let pd = [...this.state.product_data];
            pd[this.state.selectedForm].products_data.image_data.other_images.forEach(photo => {
              if (photo !== img) {
                x.push(photo);
              }
            });
            pd[this.state.selectedForm].products_data.image_data.other_images = x;
            this.setState({product_data: pd});
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

    const toggleVariation = variation => {
      if (this.state.selectedVariations.includes(variation.name)) {
        let arr, arr2;
        arr = this.state.selectedVariations.filter(function (selected_variation) {
          return selected_variation !== variation.name;
        });
        arr2 = this.state.selectedFullVariations.filter(function (selected_variation) {
          return selected_variation.name !== variation.name;
        });
        this.setState({selectedVariations: arr, selectedFullVariations: arr2});
      } else {
        let arr = [...this.state.selectedVariations],
          arr2 = [...this.state.selectedFullVariations];
        arr.push(variation.name);
        arr2.push(variation);

        this.setState({selectedVariations: arr, selectedFullVariations: arr2});
      }
    };

    const getVariations = variationsData => {
      let pvArr = [];
      variationsData.forEach(vd => {
        let attributesArr = [];
        this.state.formData.productvariationdatafields.forEach((field, i) => {
          const attributes = {
            name: field.productVarFields.name,
            identifier: field.productVarFields.identifier,
            value: '',
          };
          attributesArr = [...attributesArr, Object.assign({}, attributes)];
        });
        let pv = {};
        if (vd.sku === 'free-size') {
          pv = {
            variation_value: 'Free Size',
            variation_name: 'Free Size',
            variation_name_sku: 'free-size',
            variation_value_sku: 'free-size',
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        } else {
          pv = {
            variation_value: vd.name,
            variation_name: 'Size',
            variation_name_sku: 'size',
            variation_value_sku: vd.sku,
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        }
        pvArr.push(Object.assign({}, pv));
      });
      let pd = this.state.product_data;
      pd[this.state.selectedForm].products_data.product_variations = [...pvArr];
      this.setState({product_data: [...pd]});
    };

    const applyVariations = () => {
      this.setState({showSizeOptions: false, variationsData: this.state.selectedFullVariations});
      getVariations(this.state.selectedFullVariations);
    };
    const resetVariations = () => {
      this.setState({
        showSizeOptions: false,
        selectedVariations: [],
        selectedFullVariations: [],
        variationsData: [],
      });
      let pd = this.state.product_data;
      pd[this.state.selectedForm].products_data.product_variations = [];
      this.setState({product_data: pd});
    };
    const changeForm = i => {
      if (this.state.product_data[i].products_data.product_variations.length > 0) {
        let arr1 = [],
          arr2 = [];
        this.state.product_data[i].products_data.product_variations.forEach(pv => {
          arr1.push(pv.variation_value);
          let x = {
            name: pv.variation_value,
            sku: pv.variation_value_sku,
          };
          arr2.push(x);
        });
        this.setState({
          selectedVariations: [...arr1],
          selectedFullVariations: [...arr2],
          variationsData: [...arr2],
          selectedForm: i,
          showSizeOptions: false,
        });
      } else {
        this.setState({
          selectedVariations: [],
          selectedFullVariations: [],
          variationsData: [],
          selectedForm: i,
          showSizeOptions: false,
        });
      }
    };

    const reset = () => {
      this.setState({
        showSizeOptions: false,
        selectedVariations: [],
        selectedFullVariations: [],
        variationsData: [],
        selectedForm: 0,
        formData: null,
        product_data: [],
      });
    };
    const discardListing = () => {
      this.props.changeTab('categories');
      reset();
    };

    const saveListing = () => {
      const token = this.props.token;
      let pr = [];
      this.state.product_data.forEach(product => pr.push(Object.assign({}, product.products_data)));
      var raw = JSON.stringify({
        category_4_id: this.state.formData.category_data.category_4_id,
        type: 'draft',
        products_data: pr,
      });

      var requestOptions = {
        method: 'POST',
        headers: {
          token: token,
          'Content-Type': 'application/json',
        },
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/submit_product_lst_form`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.changeTab('categories');
            reset();
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => toast.error('error', error));
    };

    const submitListing = () => {
      console.log('here');
      const token = this.props.token;
      let pr = [];
      this.state.product_data.forEach(product => pr.push(Object.assign({}, product.products_data)));
      var raw = JSON.stringify({
        category_4_id: this.state.formData.category_data.category_4_id,
        type: 'submit',
        products_data: pr,
      });

      var requestOptions = {
        method: 'POST',
        headers: {
          token: token,
          'Content-Type': 'application/json',
        },
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/submit_product_lst_form`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.changeTab('categories');
            reset();
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => toast.error('error', error));
    };
    return (
      <View>
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF'}}>Add Product Details</Text>
        {(this.state.formData && this.state.product_data.length > 0) ? (
          <ScrollView style={{paddingHorizontal: 20, marginBottom: 130}}>
            <View style={{marginBottom: 20}}>
              <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10}}>
                {this.state.product_data.map((product, i) => (
                  <Pressable onPress={() => changeForm(i)} key={i}>
                    <Image source={{uri: product?.products_data?.image_data?.front_image_url}} style={{width: 70, height: 70}} />
                    <Text style={{width: 70, textAlign: 'center', fontSize: 11, backgroundColor: this.state.selectedForm === i ? '#00b094' : '#fff', color: this.state.selectedForm === i ? '#fff' : '#000', fontFamily: 'Roboto-Bold', paddingVertical: 2}}>Product {i + 1}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb'}}>Product Images</Text>
              <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10}}>
                <View>
                  <Image source={{uri: this.state.product_data[this.state.selectedForm]?.products_data?.image_data?.front_image_url}} style={{width: 70, height: 70}} />
                  <Text style={{width: 70, textAlign: 'center', fontSize: 11, backgroundColor: '#ebebeb', fontFamily: 'Roboto-Bold', paddingVertical: 2}}>Main Image</Text>
                </View>
                {this.state.product_data[this.state.selectedForm]?.products_data?.image_data?.other_images.map((img, i) => (
                  <Pressable key={i} style={{position: 'relative'}} onPress={() => delImage(img)}>
                    <Image source={{uri: img}} style={{width: 70, height: 70}} />
                    {!this.state.imageLoading && <AIcon name="close" size={20} color="#ff0000" style={{position: 'absolute', top: 5, right: 5, backgroundColor: 'white', borderRadius: 20}} />}
                    {this.state.imageLoading && (
                      <View style={{width: 70, height: 70, backgroundColor: '#00000060', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator color={'#ffffff'} size={20} />
                      </View>
                    )}
                    <Text style={{width: 70, textAlign: 'center', fontSize: 11, backgroundColor: '#ebebeb', fontFamily: 'Roboto-Bold', paddingVertical: 2}}>Image {i + 1}</Text>
                  </Pressable>
                ))}
                <Pressable onPress={() => requestCameraPermission('gallery')}>
                  <View style={{width: 70, height: 70, borderColor: '#0000ff', borderWidth: 1, borderRadius: 5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.addImageButtonLoading ? <ActivityIndicator size={25} color={'blue'} /> : <AIcon name="plus" color="blue" size={25} />}</View>
                  <Text style={{width: 70, textAlign: 'center', fontSize: 11, backgroundColor: '#ebebeb', fontFamily: 'Roboto-Bold', paddingVertical: 2}}>Add Image</Text>
                </Pressable>
              </View>
              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginBottom: 5, marginTop: 10}}>Product, Size and Inventory</Text>

              {this.state.formData.productsizeinvtfields.map(field => (
                <GetFormInput
                  key={field.product_size_inventory_fields_id}
                  id={field.product_size_inventory_fields_id}
                  name={field.name}
                  identifier={field.identifier}
                  type={field.input_types}
                  required={field.required}
                  description={field.description}
                  placeholder={field.placeholder}
                  options={field.options || []}
                  value={this.state.product_data[this.state.selectedForm].products_data.productsizeinvtfields[field.identifier]}
                  changeValue={e => {
                    let pd = this.state.product_data;
                    pd[this.state.selectedForm].products_data.productsizeinvtfields[field.identifier] = e;
                    this.setState({product_data: [...pd]});
                    // setProductData((productData: any) => [...pd]);
                  }}
                />
              ))}

              <Pressable style={{position: 'relative'}} onPress={() => this.setState({showSizeOptions: !this.state.showSizeOptions})}>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Select Size</Text>
                  <Text style={{borderWidth: 1, borderColor: '#697475', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, fontSize: 16}}>Select Size</Text>
                </View>
              </Pressable>
              {this.state.showSizeOptions && (
                <View style={{backgroundColor: 'white', width: '100%', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderWidth: 1, borderColor: 'black', zIndex: 999, flexDirection: 'row', borderRadius: 10, marginTop: 5}}>
                  <Pressable
                    style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 110}}
                    onPress={() => {
                      toggleVariation(this.state.formData.productvariationsfields[1].variation);
                    }}>
                    <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(this.state.formData.productvariationsfields[1]?.variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                    <Text>{this.state.formData.productvariationsfields[1]?.variation.name}</Text>
                  </Pressable>
                  {this.state.formData.productvariationsfields[0].variation.variation_values.map((variation, i) => (
                    <Pressable
                      key={i}
                      style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 50}}
                      onPress={() => {
                        toggleVariation(variation);
                      }}>
                      <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                      <Text>{variation.name}</Text>
                    </Pressable>
                  ))}
                  <View style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', paddingTop: 10, gap: 10}}>
                    <Pressable onPress={() => resetVariations()}>
                      <Text style={{backgroundColor: 'red', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Reset</Text>
                    </Pressable>
                    <Pressable onPress={() => applyVariations()}>
                      <Text style={{backgroundColor: 'blue', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Apply</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Table */}
              <ScrollView horizontal={true} style={{marginTop: 10, borderColor: 'black'}}>
                {this.state.product_data[this.state.selectedForm].products_data.product_variations.length > 0 && (
                  <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}}>
                      <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                        <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>Size</Text>
                      </View>
                      {this.state.formData.productvariationdatafields.map((field, i) => (
                        <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                          <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.productVarFields.name}</Text>
                        </View>
                      ))}
                      {this.state.formData.productpricetaxfields.map((field, i) => (
                        <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                          <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.name}</Text>
                        </View>
                      ))}
                    </View>

                    {this.state.product_data[this.state.selectedForm].products_data.product_variations.map((variation, i) => {
                      return (
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}} key={i}>
                          <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                            <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{variation.variation_value}</Text>
                          </View>
                          {this.state.formData.productvariationdatafields.map((field, j) => (
                            <GetTableFormInput
                              id={field.productVarFields.identitfier}
                              name={field.productVarFields.name}
                              options={field.productVarFields.options}
                              identifier={field.productVarFields.identifier}
                              type={field.productVarFields.input_types}
                              required={field.productVarFields.required}
                              placeholder={field.productVarFields.placeholder}
                              value={this.state.product_data[this.state.selectedForm].products_data.product_variations[i].variation_attributes[j].value}
                              changeValue={e => {
                                let pd = this.state.product_data;
                                this.state.product_data[this.state.selectedForm].products_data.product_variations[i].variation_attributes[j].value = e;
                                this.setState({product_data: [...pd]});
                              }}
                            />
                          ))}
                          {this.state.formData.productpricetaxfields.map((field, j) => (
                            <GetTableFormInput
                              id={field.identitfier}
                              name={field.name}
                              options={field.options}
                              identifier={field.identifier}
                              type={field.input_types}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={this.state.product_data[this.state.selectedForm].products_data.product_variations[i][field.identifier]}
                              changeValue={e => {
                                let pd = this.state.product_data;
                                this.state.product_data[this.state.selectedForm].products_data.product_variations[i][field.identifier] = e;
                                this.setState({product_data: [...pd]});
                              }}
                            />
                          ))}
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>

              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginBottom: 5, marginTop: 10}}>Product Details</Text>

              {this.state.formData.productdetailfields.map((field, i) => (
                <GetFormInput
                  key={field.product_details_fields_id}
                  id={field.product_details_fields_id}
                  name={field.product_details_field.name}
                  identifier={field.product_details_field.identifier}
                  type={field.product_details_field.input_types}
                  required={field.product_details_field.required}
                  description={field.product_details_field.description}
                  placeholder={field.product_details_field.placeholder}
                  options={field.product_details_field.options || []}
                  value={this.state.product_data[this.state.selectedForm].products_data.productdetailfields[i].value}
                  changeValue={e => {
                    let pd = this.state.product_data;
                    pd[this.state.selectedForm].products_data.productdetailfields[i].value = e;
                    this.setState({product_data: [...pd]});
                  }}
                />
              ))}
              <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#ebebeb', marginBottom: 5, marginTop: 10}}>Other Attributes</Text>

              {this.state.formData.productotherfields.map((field, i) => (
                <GetFormInput
                  key={field.product_other_fields_id}
                  id={field.product_other_fields_id}
                  name={field.product_other_field.name}
                  identifier={field.product_other_field.identifier}
                  type={field.product_other_field.input_types}
                  required={field.product_other_field.required}
                  description={field.product_other_field.description}
                  placeholder={field.product_other_field.placeholder}
                  options={field.product_other_field.options || []}
                  value={this.state.product_data[this.state.selectedForm].products_data.productotherfields[i].value}
                  changeValue={e => {
                    let pd = this.state.product_data;
                    pd[this.state.selectedForm].products_data.productotherfields[i].value = e;
                    this.setState({product_data: [...pd]});
                  }}
                />
              ))}

              <View style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', paddingTop: 10, gap: 10}}>
                <Pressable onPress={() => discardListing()}>
                  <Text style={{backgroundColor: 'red', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Discard</Text>
                </Pressable>
                <Pressable onPress={() => saveListing()}>
                  <Text style={{backgroundColor: 'blue', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Save</Text>
                </Pressable>
                <Pressable onPress={() => submitListing()}>
                  <Text style={{backgroundColor: 'green', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        ) : <View style={{paddingVertical: 30}}><ActivityIndicator size={30} color={"blue"} /></View>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginTop: 2,
    fontSize: 14,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 3,
  },
  inputBox: {
    marginVertical: 5,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  tablePickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 14,
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  tableInput: {
    borderWidth: 1,
    borderColor: '#697475',
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 25,
    backgroundColor: 'white',
    marginTop: 2,
    fontSize: 14,
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(ProductDetails);
