const path = require('path')
const fs = require('fs')

// Require bubblewrap core from npx cache
const core = require('C:/Users/sammy/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules/@bubblewrap/core')

const targetDir = 'C:/Users/sammy/snapchef-twa'
const templateDir = 'C:/Users/sammy/AppData/Local/npm-cache/_npx/881cef4662d2c421/node_modules/@bubblewrap/core/template_project'

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const twaManifestData = {
  packageId: 'app.vercel.snapchef_ai.twa',
  host: 'snapchef-ai.vercel.app',
  name: 'SnapChef AI - Smart Fridge Scanner',
  launcherName: 'SnapChef AI',
  display: 'standalone',
  themeColor: '#052e16',
  themeColorDark: '#052e16',
  navigationColor: '#052e16',
  navigationColorDark: '#052e16',
  navigationDividerColor: '#00000000',
  navigationDividerColorDark: '#00000000',
  backgroundColor: '#052e16',
  enableNotifications: false,
  startUrl: '/',
  iconUrl: 'http://localhost:8080/icons/icon-512.png',
  maskableIconUrl: 'http://localhost:8080/icons/icon-maskable-512.png',
  splashScreenFadeOutDuration: 300,
  signingKey: {
    path: 'C:/Users/sammy/snapchef-ai/snapchef.keystore',
    alias: 'snapchef-key',
  },
  appVersionCode: 1,
  appVersionName: '1.0.0',
  shortcuts: [],
  generatorApp: 'bubblewrap-cli',
  webManifestUrl: 'http://localhost:8080/manifest.json',
  fallbackType: 'customtabs',
  features: {},
  alphaDependencies: {
    enabled: false,
  },
  enableSiteSettingsShortcut: true,
  isChromeOSOnly: false,
  isMetaQuest: false,
  minSdkVersion: 21,
  orientation: 'portrait',
  fingerprints: [
    {
      value: '6C:6D:08:A9:FE:AF:21:20:11:7D:C8:17:1D:64:A4:CE:BD:4D:92:6B:38:B9:6E:85:D1:2A:DE:D7:69:63:46:26',
    },
  ],
  additionalTrustedOrigins: [],
  retainedBundles: [],
}

async function main() {
  console.log('Instantiating TwaManifest...')
  const twaManifest = new core.TwaManifest(twaManifestData)
  
  // Save twa-manifest.json in targetDir
  fs.writeFileSync(
    path.join(targetDir, 'twa-manifest.json'),
    JSON.stringify(twaManifest.toJson(), null, 2),
    'utf-8'
  )
  console.log('Saved twa-manifest.json to', targetDir)

  console.log('Creating TWA Project via TwaGenerator...')
  const generator = new core.TwaGenerator()
  await generator.createTwaProject(targetDir, twaManifest, templateDir)
  console.log('TWA Project created successfully in', targetDir)
}

main().catch((err) => {
  console.error('Error generating TWA project:', err)
  process.exit(1)
})
