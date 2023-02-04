import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Chatapp',
  webDir: 'dist/chatappfront',
  bundledWebRuntime: false,
  plugins: {

  "SplashScreen":{
  "launchShowDuration": 0
  },
  LocalNotifications: {
    smallIcon: "ic_stat_icon_config_sample",
    iconColor: "#488AFF",
    sound: "beep.wav",
  },
  },
  "cordova": {}

};

export default config;
