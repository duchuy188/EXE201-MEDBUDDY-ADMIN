
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ab34c548d19244aa8d7c8fddbdbe2db8',
  appName: 'medbuddy-ui-web',
  webDir: 'dist',
  server: {
    url: 'https://ab34c548-d192-44aa-8d7c-8fddbdbe2db8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#A0E7E5",
      sound: "beep.wav",
    },
  },
};

export default config;
