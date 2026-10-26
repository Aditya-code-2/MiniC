import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aditya.minic',
  appName: 'MiniC',
  webDir: 'build',
  server: {
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;
