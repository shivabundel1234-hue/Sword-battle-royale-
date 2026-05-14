# World Of Sword Battle Royale - Android Game

A fast-paced sword fighting battle royale game for Android devices.

## Features

- ⚔️ Real-time sword combat
- 🤖 Intelligent AI enemies
- 💪 Health & Power system
- 📱 Touch-optimized controls
- 🏆 Score tracking
- 🎮 Multiple enemy waves
- ✨ Visual effects and animations

## Game Mechanics

### Controls
- **Touch/Click anywhere** to move the player towards that position
- **Hold and release** to perform a power attack
- **Charge longer** for maximum damage (25 HP vs 10 HP)

### Combat System
- Attack range: 80 pixels
- Normal attack: 10 damage
- Power attack: 25 damage
- Enemy damage: 0.3 HP per frame when close
- Enemy scaling: Each wave gets faster and stronger

### Progression
- Defeat all enemies to advance to next wave
- Gain points for each enemy defeated (100 + wave bonus)
- HP recovers between waves
- Difficulty increases with each wave

## Project Structure

```
.
├── game/
│   ├── index.html          # Game HTML interface
│   └── game.js             # Game logic and rendering
├── android/
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/swordbattle/game/
│   │   │   │   └── MainActivity.java
│   │   │   ├── assets/
│   │   │   │   └── index.html
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
└── README.md
```

## Quick Start - Web Version

1. **Clone the repository**
   ```bash
   git clone https://github.com/shivabundel1234-hue/Sword-battle-royale-.git
   cd Sword-battle-royale-
   ```

2. **Open the game**
   - Simply open `game/index.html` in your web browser
   - Use mouse to move and click to attack
   - On mobile, tap to move and hold to charge attack

## Setup for Android APK

### Requirements
- Android Studio 2021+
- Android SDK 21+
- Java 8+
- Gradle 7.0+

### Build Steps

1. **Clone and open in Android Studio**
   ```bash
   git clone https://github.com/shivabundel1234-hue/Sword-battle-royale-.git
   cd Sword-battle-royale-/android
   ```

2. **Open `android/` directory in Android Studio**
   - File → Open → Select `android` folder
   - Let Gradle sync automatically

3. **Configure Assets**
   - Copy `game/index.html` to `android/app/src/main/assets/`
   - Create `assets` folder if it doesn't exist

4. **Build the APK**
   - Build → Generate Signed APK
   - Follow the signing process
   - Select release build type

5. **Install on Device**
   - Connect Android device via USB
   - Enable USB debugging
   - Build → Build APK
   - Transfer APK and install

## Game Tips

- 🎯 **Aim for groups**: Attack multiple enemies clustered together
- ⚡ **Use power attacks**: Hold for maximum damage on tough enemies
- 🏃 **Keep moving**: Don't let enemies surround you
- 💚 **Manage HP**: Back away to recover health between waves
- 🌊 **Wave difficulty**: Each wave has more enemies and they're stronger

## Gameplay Features

### Wave System
- Waves increase in difficulty progressively
- Each wave spawns 3 + wave number enemies
- Enemy HP and speed increase with waves
- Player receives HP recovery between waves

### Combat Mechanics
- **Distance-based damage**: Only deal damage within attack range
- **Power charging**: Longer hold = more damage
- **Flash effect**: Visual feedback when enemies take damage
- **Particle effects**: Visual feedback for attacks and hits

### UI Elements
- Player HP bar (red/yellow/green based on health)
- Wave counter
- Score display
- Wave transition messages
- Game over screen with final stats

## Future Enhancements

### v1.1 (Planned)
- [ ] Multiple weapon types (spear, axe, mace)
- [ ] Power-ups (health boost, damage multiplier)
- [ ] Special abilities and ultimate attacks
- [ ] Sound effects and background music

### v2.0 (Future)
- [ ] Multiplayer mode (local & online)
- [ ] 3D graphics upgrade
- [ ] Battle royale map with zones
- [ ] Cosmetic skins and customization
- [ ] Leaderboard system
- [ ] Seasonal content

## Technical Stack

- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Android**: WebView wrapper with Java
- **Build System**: Gradle
- **Target API**: Android 21+ (96%+ device coverage)

## Performance

- 60 FPS gameplay target
- Optimized Canvas rendering
- Efficient particle system
- Mobile-friendly touch controls
- Low memory footprint

## License

MIT License - Feel free to modify, fork, and share!

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Support

For issues or questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review documentation

---

**Made with ❤️ for mobile gaming**

Developed using HTML5 Canvas and Android WebView technology.
