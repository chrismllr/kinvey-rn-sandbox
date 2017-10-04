import Kinvey from 'kinvey-react-native-sdk';

export default function initKinvey() {
  Kinvey.initialize({
    appKey: 'kid_Bkj9lZ_i-',
    appSecret: '5100575c37d34326aca1d3fd33976365'
  });

  return Kinvey.ping();
}