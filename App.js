import React from 'react';
import Chance from 'chance';
import Kinvey from 'kinvey-react-native-sdk';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import initKinvey from './init-kinvey';
import { retrieve, persist } from './persist-user';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    alignItems: 'center'
  },
  bold: {
    fontSize: 16,
    fontWeight: '700'
  },
  button: {
    color: 'tomato',
    fontSize: 16,
    fontWeight: '600'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class App extends React.Component {
  state = {
    user: null,
    books: []
  };

  async componentDidMount() {
    await initKinvey();
    this._createDatastores();

    try {
      await this._getActiveUser();
      this._getAllBooks();
    } catch (err) {
      console.log(err);
    }
  }

  datastores = {};
  chance = new Chance();

  _createDatastores() {
    this.datastores = {
      books: Kinvey.DataStore.collection(
        'books',
        Kinvey.DataStoreType.Cache
      )
    };
  }

  async _getActiveUser() {
    try {
      const userData = await retrieve();
      Kinvey.client.setActiveUser(userData);

      const found = Kinvey.User.getActiveUser();
      this.setState({ user: found });

      return found;
    } catch (err) {
      throw err;
    }
  }

  _logIn = async () => {
    const user = await Kinvey.User.login({
      username: 'chris',
      password: 'password'
    });

    this.setState({ user: user.data });
    return persist(user);
  }

  _getAllBooks() {
    const stream = this.datastores.books.find();

    stream.subscribe(books => {
      console.log('found some books', books);
      this.setState({ books });
    });
  }

  _saveARecord = async () => {
    try {
      await this.datastores.books.save({
        author: this.chance.name(),
        title: this.chance.word()
      });

      this._getAllBooks();
    } catch (err) {
      alert(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          {this.state.user && (
            <Text style={styles.bold}>{this.state.user.username} is now logged in.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Current Books</Text>

          {this.state.books.map((bk, i) => (
            <Text key={i}>{bk.title} by {bk.author}</Text>
          ))}
        </View>

        <View style={styles.section}>
          {!this.state.user &&
            <TouchableOpacity onPress={this._logIn}>
              <Text>Log In</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={styles.section}>
          <TouchableOpacity onPress={this._saveARecord}>
            <Text style={styles.button}>Create a book</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
