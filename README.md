Google Chrome Extension to inject Pokemon's IVs into UI for Fields.

View Pokémon IV stats directly in PokéFarm Q field tooltips with perfect IV highlights.

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

### Installation

Google Chrome
1. Download the latest .XPI release file from [releases](/releases/).
2. Unzip and extract contents from .XPI file
3. Manage Extensions > Turn ON Developer Mode (top right corner)
4. Load unpacked > Select extracted folder
5. "Extension Loaded" means you're good to go!
6. Refresh on PFQ!

Firefox
1. Download the latest .ZIP release file from [releases](/releases/).
2. Navigate to [Developer Settings for Extensions](https://about:debugging#/runtime/this-firefox)
3. Load Temporary Add-On > Select ZIP file
4. You should see PokefarmQ IV Checker listed under Temporary Extensions
5. Refresh on PFQ!

Safari
1. Download the latest .XPI release file from [releases](/releases/).
2. Safari menu (top left) > Settings > Advanced > check "Show features for web developers"
3. Switch to "Developer" tab in Settings window
4. Add Temporary Extension > select .XPI file
5. Ensure PokefarmQ IV Checker extension is enabled (checkbox ON)
6. Enable extension for website: Edit Websites > change pokefarm.com dropdown to "Allow"
7. Refresh on PFQ!

### Ideas / Suggestions?

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "NEW:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please!

### Troubleshooting

Please [create an issue](https://github.com/mtl3jx/pokefarmq-iv-checker/issues) in this repo prefixed with "BUG:" OR send me ([6lackr0se](https://discord.com/users/418475101244358666)) a message on discord. Include any helpful details and screenshots please!

Please don't send me PMs on PFQ - I'd like to keep that inbox game-specific!

### Notes

Only Desktop browser is supported at this time. Mobile browser support is WIP! You will need to install these manually as a developer until the browser extension listings are approved.

IVs are cached during the browsing session to improve performance and reduce repeated page requests.

### Supported Pages

This extension currently runs on the PokéFarm Fields page:
https://pokefarm.com/fields

### [Privacy Policy](/privacy-policy.md)

This extension does not collect, store, or transmit any personal data.

All processing occurs locally in your browser and the extension only reads publicly available information from PokéFarm pages in order to display IV statistics.

### Disclaimer

PokéFarm Field IV Viewer is an independent fan-made tool and is not affiliated with or endorsed by PokéFarm.
