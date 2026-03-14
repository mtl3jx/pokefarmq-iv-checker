Browser Extensions to inject Pokemon's IVs into UI for Fields / Parties / etc.

View Pokémon IV stats directly in PokéFarm Q field tooltips with perfect IV or zero IV highlights.

## PokéFarm Field IV Viewer

PokéFarm Field IV Viewer enhances the PokéFarm Fields page by displaying Pokémon Individual Values (IVs) directly inside the tooltip when hovering over a Pokémon.

This allows players to quickly evaluate Pokémon in the field without opening each summary page individually.

### Features

- Displays IV overlay in Fields highlighting perfect IVs and nundos
- Displays Pokemon IVs in user + other players' parties
- Displays Pokémon IV stats directly in the tooltip window
- Highlights perfect IVs (31) with underline, bold, text color, and numerical indicator for how many perfect and 0 IVs
- Automatically prefetches IV data for Pokémon currently visible in the field
- Lightweight and designed to blend with the existing PokéFarm interface

<details>
  <summary>Screenshots</summary>
  
  ![6IVs](https://github.com/user-attachments/assets/416d4850-96dd-4b7c-be82-8a19901632e8)
  
  ![party IVs](https://github.com/user-attachments/assets/ca3b9fa0-cadf-4956-ab9b-e6a72fed2202)
  
  ![1 IV](https://github.com/user-attachments/assets/71d106d0-64f5-4d70-9712-740ef8d8a4ff)
</details>

## Installation

1. Download the latest .XPI release file from [releases](/releases/). If there is only a .ZIP available, rename the file with an .XPI extension.

Supported Browsers:
- Firefox Nightly 📱![android logo](/icons/logo-android-20.png)
- Orion 📱![ios logo](/icons/logo-apple-20.png)
- Google Chrome 💻
- Safari 💻
- Firefox 💻

#### ![firefox nightly logo](/icons/logo-firefox-nightly-20.png) Firefox Nightly - Mobile ![android logo](/icons/logo-android-20.png) / Desktop 💻

Firefox Nightly is a Developer specific version of the browser. The Nightly Mobile app allows you to load browser extensions in from a file. [Install on Android](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en_US) ~~or Install on iOS (currently unavailable).~~

2. Download and install Firefox Nightly (or another mobile browser that allows extensions)
3. In the browser, turn on Developer Mode. Menu > Settings > About Firefox Nightly > click the logo rapidly 5+ times until it says "Debug menu enabled"
2. Allow unverified extensions (Done at your own risk - I'm not responsible for anything you do outside of this extension) 
```
about:config
```

5. Search for "signatures" and toggle `xpinstall.signatures.required` to false.
6. Install the PokefarmQ IV Checker extension on your browser. Menu > Settings > Install extension from file > select the .XPI file > Add
7. You should now see PokefarmQ IV Checker listed under Extensions
8. Refresh on PFQ!

#### ![orion logo](/icons/logo-orion-20.png) Orion - Mobile ![ios logo](/icons/logo-apple-20.png)

The Orion Mobile app allows you to load browser extensions in from a file. [Install on iOS](https://apps.apple.com/us/app/orion-browser-by-kagi/id1484498200).

2. Download and install Orion (or another mobile browser that allows extensions)
3. Enable extensions: Options icon > Settings > Advanced > Enable Chrome extensions (it may prompt you for this upon installation)
4. More Options icon > Extensions > Add extension > Install from File
5. Select the .XPI file
6. You should now see PokefarmQ IV Checker listed under Extensions
7. Refresh on PFQ!

#### ![google chrome logo](/icons/logo-google-chrome-20.png) Google Chrome - Desktop 💻

1. Download the latest .XPI release file from [releases](/releases/).
2. Unzip and extract contents from .XPI file
3. Manage Extensions > Turn ON Developer Mode (top right corner)
4. Load unpacked > Select extracted folder
5. "Extension Loaded" means you're good to go!
6. Refresh on PFQ!

Chrome extension listing in store pending!

#### ![safari logo](/icons/logo-safari-20.png) Safari - Desktop 💻

1. Download the latest .XPI release file from [releases](/releases/).
2. Safari menu (top left) > Settings > Advanced > check "Show features for web developers"
3. Switch to "Developer" tab in Settings window and ensure "Allow Unsigned Extensions" is enabled
4. Add Temporary Extension > select .XPI file
5. Ensure PokefarmQ IV Checker extension is enabled (checkbox ON)
6. Enable extension for website: Edit Websites > change pokefarm.com dropdown to "Allow"
7. Refresh on PFQ!

These steps will need to be done every time a new Safari session starts since it doesn't keep temporary extensions.

#### ![firefox logo](/icons/logo-firefox-20.png) Firefox - Desktop 💻
1. Download the latest .ZIP release file from [releases](/releases/).
2. Navigate to [Developer Settings for Extensions](https://about:debugging#/runtime/this-firefox)
3. Load Temporary Add-On > Select ZIP file
4. You should see PokefarmQ IV Checker listed under Temporary Extensions
5. Refresh on PFQ!

These steps will need to be done every time a new Firefox session starts since it doesn't keep temporary extensions. Firefox extension listing in store pending!


### Ideas / Suggestions?

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "NEW:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please! Feel free to leave comments on anything anyone else posts as well; the more interest the sooner I'll work on it.

Please don't send me PMs on PFQ - I'd like to keep that inbox game-specific!

### Troubleshooting

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "BUG:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please!

Please don't send me PMs on PFQ - I'd like to keep that inbox game-specific!

### Notes

Mobile and Desktop browsers are supported! You will need to install these manually as a developer until the browser extension listings are approved.

IVs are cached during the browsing session to improve performance and reduce repeated page requests.

Generate .XPI or .ZIP files using
```
zip -r releases/pfq-1.0.1.xpi manifest.json *.js styles.css icons/* README.md privacy-policy.md
```

### Supported Pages

This extension currently runs on the PokéFarm Fields page:
https://pokefarm.com/fields

### [Privacy Policy](/privacy-policy.md)

This extension does not collect, store, or transmit any personal data.

All processing occurs locally in your browser and the extension only reads publicly available information from PokéFarm pages in order to display IV statistics.

### Disclaimer

PokéFarm Field IV Viewer is an independent fan-made tool and is not affiliated with or endorsed by PokéFarm.
