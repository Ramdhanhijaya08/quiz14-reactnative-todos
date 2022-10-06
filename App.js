import React, {Component} from 'react';
import {View, Text, StatusBar, FlatList, TouchableOpacity} from 'react-native';
import {Hoshi} from 'react-native-textinput-effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

let data = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodo: '',
      openModal: false,
      index: -1,
      text: '',
      editMode: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('@todoData', JSON.stringify(data));
      console.warn('Sukses menyimpan');
    } catch (error) {
      // Error saving data
      console.warn('error menyimpan data');
    }
  };

  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('@todoData');
      const jsonValue = JSON.parse(value);

      if (jsonValue !== null) {
        // We have data!!
        data = jsonValue;
        this.setState({});
      }
    } catch (error) {
      // Error retrieving data
      console.warn('error membaca data');
    }
  };

  addNewTodo = () => {
    data.push({
      todo: this.state.newTodo,
      check: false,
    });
    this.setState({newTodo: ''});
    this.storeData();
  };

  edit = () => {
    this.setState({newTodo: this.state.text, editMode: true, openModal: false});
  };

  onSubmitEdit = () => {
    data[this.state.index].todo = this.state.newTodo;
    console.warn(data[this.state.index].todo);
    this.setState({editMode: false, newTodo: ''});
    this.storeData();
  };

  delete = index => {
    data.splice(index, 1);
    this.setState({openModal: false});
    this.storeData();
  };

check = (index) => {
  data[index].check = !data[index].check;
  this.setState({});
  this.storeData();
}

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#38E54D" barStyle="light-content" />
        <View
          style={{
            backgroundColor: '#38E54D',
            paddingVertical: 15,
            elevation: 1,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            TODOLIST
          </Text>
        </View>

        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={{
                marginHorizontal: 20,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#083AA9',
                paddingVertical: 15,
                borderRadius: 5,
                backgroundColor: '#FFFFFF',
                elevation: 1,
                flexDirection: 'row',
              }}
              onLongPress={() =>
                this.setState({openModal: true, index: index, text: item.todo})
              }>
                <View style={{flex: 1, justifyContent:'center'}}>
              <Text style={{marginLeft: 10}}>{item.todo}</Text>
              </View>
             <Icon name= { item.check ? 'check-square' : 'square'} size={30} color="#b2ff59" style={{marginHorizontal: 10}} 
             onPress = {() => this.check(index)}
             
             />
            
            </TouchableOpacity>
          )}
          keyExtractor={item => item.todo}
          style={{flex: 1, backgroundColor: '#f5f5f5'}}
        />

        {/* <Text>{this.state.newTodo}</Text> */}

        <Hoshi
          label={'Tambah todo baru'}
          // this is used as active border color
          borderColor={'#38E54D'}
          // active border height
          borderHeight={3}
          inputPadding={16}
          // this is used to set backgroundColor of label mask.
          // please pass the backgroundColor of your TextInput container.
          backgroundColor={'#F9F7F6'}
          value={this.state.newTodo}
          onChangeText={text => this.setState({newTodo: text})}
          onSubmitEditing={() =>
            this.state.editMode ? this.onSubmitEdit() : this.addNewTodo()
          }
        />

        <Modal isVisible={this.state.openModal}>
          <View
            style={{backgroundColor: 'white', padding: 10, borderRadius: 5}}>
            {/* Edit */}
            <TouchableOpacity
              style={{backgroundColor: '#2979ff', paddingVertical: 10}}
              onPress={() => this.edit(this.state.text)}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Edit
              </Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              style={{
                backgroundColor: '#ff1744',
                paddingVertical: 10,
                marginVertical: 10,
              }}
              onPress={() => this.delete(this.state.index)}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Delete
              </Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity
              style={{backgroundColor: '#90a4ae', paddingVertical: 10}}
              onPress={() => this.setState({openModal: false})}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default App;
