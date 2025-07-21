import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('kl8A5jkv4U2YstPaZxy8oE3o9hKCXDNbmPxDGwtF', 'SVmcOY9PH6vl42spPa5KBheTAMOiWb1K9BfAuPyw');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;