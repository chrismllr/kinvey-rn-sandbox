import { AsyncStorage } from 'react-native';

export async function retrieve() {
  const user = await AsyncStorage.getItem('activeUser');
  if (user) return JSON.parse(user).data;

  throw new Error('No active user');
}

export function persist(user) {
  return AsyncStorage.setItem('activeUser', JSON.stringify(user));
}

export function remove() {
  return AsyncStorage.removeItem('activeUser');
}