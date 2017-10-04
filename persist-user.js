import { AsyncStorage } from 'react-native';

export async function retrieve() {
  const user = await AsyncStorage.getItem('activeUser');

  return user.data;
}

export function persist(user) {
  return AsyncStorage.setItem('activeUser', JSON.parse(user));
}

export function remove() {
  return AsyncStorage.removeItem('activeUser');
}