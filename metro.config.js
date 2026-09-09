// metro.config.js — My Farm
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Allow Metro to bundle .wasm files (needed by expo-sqlite web)
config.resolver.assetExts.push('wasm');

// 2. On web, replace expo-sqlite native module with our own web mock shim
//    so the bundler never tries to resolve wa-sqlite.wasm through the JS import chain
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'expo-sqlite' ||
      moduleName.startsWith('expo-sqlite/') ||
      moduleName.includes('expo-sqlite/web/worker') ||
      moduleName.includes('wa-sqlite'))
  ) {
    // Return empty module — our src/lib/db/database.ts already guards with Platform.OS === 'web'
    return {
      type: 'empty',
    };
  }
  // Default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
