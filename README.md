# Vigieau Card

A custom Home Assistant Lovelace card for displaying French drought water restriction data from the [kamaradclimber/vigieau](https://github.com/kamaradclimber/vigieau) integration.

## Features

- **INSEE city code configuration** - Set your location via French administrative code
- **Alert level display** - Color-coded current drought alert level (green/yellow/orange/red)
- **Restrictions grid** - All water usage categories with color-coded borders
- **Numeric progress bar** - Shows current alert level on 0-4 scale
- **Tap actions** - Open Home Assistant `more-info` dialog for detailed views
- **Fully responsive** - Works on mobile and desktop
- **French/English translations** - Built-in i18n support

## Installation

### HACS

1. Go to HACS → Frontend → Configuration → Custom repositories
2. Add repository: `https://github.com/homeassistant-fr-ecosystem/vigieau-card`
3. Select category: **Lovelace Card**
4. Refresh HACS and find **Vigieau Card** under **Lovelace cards**

### Manual

1. Build the card:
   ```bash
   cd vigieau-card
   npm run build
   ```
2. Copy `dist/vigieau-card.js` to your Home Assistant configuration's `www/` folder
3. Add to Lovelace:
   ```yaml
   type: custom:vigieau-card
   city_code: "75056"  <!-- Your INSEE city code -->
   ```

## Configuration

| Option | Description | Default |
|--------|-------------|---------|
| `city_code` | INSEE city code (required) | - |
| `show_alert_level` | Show the alert level banner | `true` |
| `show_restrictions` | Show the restrictions grid | `true` |
| `show_progress` | Show the numeric progress bar | `false` |

### Finding Your INSEE Code

French administrative codes (codes INSEE) can be found:
- On [Wikipedia](https://fr.wikipedia.org/wiki/Code_officiel_g%C3%A9ographique#Code_commune)
- In Home Assistant under `Settings > Devices & services > Integrations > Vigieau`
- Or via the card editor's help text (e.g., `75056` for Paris, `35238` for Rennes)

## Development

```bash
# Install dependencies
npm install

# Build the card
npm run build

# Lint
npm run lint

# Watch for changes
npm run watch
```

## License

MIT