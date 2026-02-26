import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.novatrade.app',
    appName: 'NovaTrade',
    webDir: 'dist',
    server: {
        // OTA Updates: App always loads from deployed Vercel URL
        // Jab bhi aap Vercel par deploy karo, app automatically update ho jaye gi
        url: 'https://novatrade-lypase.vercel.app',
        cleartext: true
    },
    android: {
        buildOptions: {
            keystorePath: undefined,
            keystoreAlias: undefined,
        }
    }
};

export default config;
