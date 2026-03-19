Browser Extensions to inject Pokemon's IVs into UI for Fields, Parties, Shelter etc.

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

Supported Browsers:
- Firefox Nightly 📱![android logo](/icons/logo-android-20.png)
- Orion 📱![ios logo](/icons/logo-apple-20.png)
- Google Chrome 💻
- Safari 💻
- Firefox 💻

1. Set your PFQ API Key in the browser Console. You can [get your PFQ API Key here.](https://pokefarm.com/farm#tab=5.7) 

   __(Desktop)__: To open browser Console (right click > Inspect). Paste the following command then hit 'Enter'.

       localStorage.setItem('pfq-api-key', '{{YOUR-PFQ-API-KEY}}');

   It's fine if it says `undefined` in the response, as long as it doesn't show an error message.

   ~OR~
   
   __(Mobile)__: Create a Bookmark that has this script as its URL. Name it something easy to remember. (ex. "Set PFQ API Key")
   
          javascript:(function(){localStorage.setItem('pfq-api-key','{{YOUR-PFQ-API-KEY}}') });

   Then, on a PFQ page start typing the name of your Bookmark in the browser URL. When the bookmark suggestion pops up, click it in order to execute that Javascript. Nothing will be displayed, but you should remain on the same page.


2. Download the latest `.XPI` (or `.ZIP` depending on your browser) release file from [releases](dist/releases/). If there is only a `.ZIP` available, rename the file with an `.XPI` extension.


#### ![firefox nightly logo](/icons/logo-firefox-nightly-20.png) Firefox Nightly - Mobile ![android logo](/icons/logo-android-20.png) / Desktop 💻

Firefox Nightly is a Developer specific version of the browser. The Nightly Mobile app allows you to load browser extensions in from a file. [Install on Android](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en_US).

3. Download and install Firefox Nightly (or another mobile browser that allows extensions)
4. In the browser, turn on Developer Mode. Menu > Settings > About Firefox Nightly > click the logo rapidly 5+ times until it says "Debug menu enabled"
5. Allow unverified extensions (Done at your own risk - I'm not responsible for anything you do outside of this extension) 

       about:config

6. Search for "signatures" and toggle `xpinstall.signatures.required` to false.
7. Install the PokefarmQ IV Checker extension on your browser. Menu > Settings > Install extension from file > select the .XPI file > Add
8. You should now see PokefarmQ IV Checker listed under Extensions
9. Refresh on PFQ!

#### ![orion logo](/icons/logo-orion-20.png) Orion - Mobile ![ios logo](/icons/logo-apple-20.png)

The Orion Mobile app allows you to load browser extensions in from a file. [Install on iOS](https://apps.apple.com/us/app/orion-browser-by-kagi/id1484498200).

3. Download and install Orion (or another mobile browser that allows extensions)
4. Enable extensions: Options icon > Settings > Advanced > Enable Chrome extensions (it may prompt you for this upon installation)
5. More Options icon > Extensions > Add extension > Install from File
6. Select the `.XPI` file
7. You should now see PokefarmQ IV Checker listed under Extensions
8. Refresh on PFQ!

#### ![google chrome logo](/icons/logo-google-chrome-20.png) Google Chrome - Desktop 💻

3. Unzip and extract contents from `.XPI` file
4. Manage Extensions > Turn ON Developer Mode (top right corner)
5. Load unpacked > Select extracted folder
6. "Extension Loaded" means you're good to go!
7. Refresh on PFQ!

Chrome extension listing in store pending!

#### ![firefox logo](/icons/logo-firefox-20.png) Firefox - Desktop 💻

3. Navigate to Developer Settings for Extensions

       about:debugging#/runtime/this-firefox

4. Load Temporary Add-On > Select `.ZIP` file
5. You should see PokefarmQ IV Checker listed under Temporary Extensions
6. Refresh on PFQ!

These steps may need to be done every time a new Firefox session starts since it doesn't keep temporary extensions. Firefox extension listing in store pending!

#### ![safari logo](/icons/logo-safari-20.png) Safari - Desktop 💻

3. Safari menu (top left) > Settings > Advanced > check "Show features for web developers"
4. Switch to "Developer" tab in Settings window and ensure "Allow Unsigned Extensions" is enabled
5. Add Temporary Extension > select `.XPI` file
6. Ensure PokefarmQ IV Checker extension is enabled (checkbox ON)
7. Enable extension for website: Edit Websites > change pokefarm.com dropdown to "Allow"
8. Refresh on PFQ!

These steps may need to be done every time a new Safari session starts since it doesn't keep temporary extensions.

## Troubleshooting

- Double check you have set your PFQ API Key in the browser.
- Double check the file type you are using is correct for your browser type (`.XPI` or `.ZIP` or unpacked)

### Bugs

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "BUG:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please!

Please don't send me PMs on PFQ - I'd like to keep that inbox game-specific!

## Ideas / Suggestions?

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "NEW:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please! Feel free to leave comments on anything anyone else posts as well; the more interest the sooner I'll work on it.

Please don't send me PMs on PFQ - I'd like to keep that inbox game-specific!

### Notes

Mobile and Desktop browsers are supported! You will need to install these manually as a developer until the browser extension listings are approved.

IVs are cached during the browsing session to improve performance and reduce repeated page requests.

#### .XPI / .ZIP / Userscript.JS Generation

Must have `npm` installed. If not, use Homebrew to install via CLI.
This compiles everything to a single `bundle.js` file (including CSS styles) that can be viewed [here](dist/bundle.js). This can be used as a userscript.
It also creates the [.XPI and .ZIP release files](dist/releases/).

```
node build.js
```

### [Privacy Policy](/privacy-policy.md)

This extension does not collect, store, or transmit any personal data.

All processing occurs locally in your browser and the extension only reads publicly available information from PokéFarm pages in order to display IV statistics.

### Disclaimer

PokéFarm Field IV Viewer is an independent fan-made tool and is not affiliated with or endorsed by PokéFarm.
