# Filipino Together — Claude Code Instructions

## Project Overview
A React Native / Expo app (SDK 56, RN 0.85, React 19, TypeScript) that teaches Tagalog and Visayan (Cebuano) to English speakers.
Runs on phone, tablet, and web. Located at `C:\Repo\claude\FilipinoTogether`.

## Architecture
- **Navigation**: state-based in `App.tsx` — stores both `screen` and `language` (tagalog | cebuano).
- **Language routing**: all screens take a `language` prop; `src/data/index.ts` returns the right content array for each language.
- **Theme**: `src/theme.ts` — ALL design tokens. Never hardcode colors, spacing, or fonts. Import `md` from this file only.
- **Speech**: `src/speech/speech.ts` — TTS uses `fil-PH` for both languages; STT uses expo-speech-recognition (native) / Web Speech API (web).
- **Progress**: `src/progress/store.ts` — Leitner SRS per language, key: `ft_progress_v1_{lang}`.
- **Content**: `src/data/tagalog/` and `src/data/cebuano/` — 6 files each (phrases, listening, speaking, dialogs, conversations, scenes).

## Design System — MANDATORY RULES

### 1. Always follow Material Design 3 (Material You)
All UI must conform to the [Material Design 3 specification](https://m3.material.io/).

### 2. Color — use semantic tokens ONLY
**Never** use a raw hex string inside a component.
Always import from `src/theme.ts`:

```ts
import { md } from "../theme";
backgroundColor: md.colors.primary          // ✅
backgroundColor: "#0038A8"                  // ❌
```

**MD3 color roles:**
| Token | Role |
|---|---|
| `md.colors.primary` | Philippine Blue — main actions |
| `md.colors.onPrimary` | Text on primary |
| `md.colors.primaryContainer` | Low-emphasis blue fills |
| `md.colors.secondary` | Philippine Red — secondary/danger |
| `md.colors.secondaryContainer` | Low-emphasis red fills |
| `md.colors.tertiary` | Philippine Gold — accent/sun |
| `md.colors.tertiaryContainer` | Gold container |
| `md.colors.tagalogPrimary` | `#0038A8` — Tagalog language brand |
| `md.colors.cebuanoPrimary` | `#CE1126` — Cebuano language brand |
| `md.colors.sunYellow` | `#FCD116` — Philippine sun accent |
| `md.colors.surface` | Card backgrounds |
| `md.colors.surfaceVariant` | Chip/input backgrounds |
| `md.colors.onSurface` | Primary text |
| `md.colors.onSurfaceVariant` | Secondary/hint text |
| `md.colors.outlineVariant` | Subtle borders |
| `md.colors.background` | Page background |

### 3. Typography — use MD3 type scale
```ts
md.typescale.headlineLarge   // 32sp — screen titles
md.typescale.titleLarge      // 22sp — card titles
md.typescale.bodyLarge       // 16sp — body copy
md.typescale.labelLarge      // 14sp — buttons
```

### 4. Shape, Spacing, Elevation
```ts
md.shape.large      // 16dp card corners
md.shape.full       // 9999dp — pills / buttons
md.spacing.lg       // 16dp
md.spacing.xl       // 24dp
md.elevation.level1 // tinted card background
```

### 5. Touch targets: minimum 48×48dp always.

### 6. Accessibility: every interactive element needs `accessibilityLabel` and `accessibilityRole`.

### 7. Android ripple: all Pressable elements must use `android_ripple={md.ripple()}`.

### 8. Theme switching: change seed colors in `src/theme.ts` only — everything else updates automatically.

## Content
- All Tagalog content: `src/data/tagalog/` (phrases, listening, speaking, dialogs, conversations, scenes)
- All Cebuano content: `src/data/cebuano/` (same structure)
- Add new phrases to the relevant file — no screen code changes needed.
- TTS language: `fil-PH` for both (Cebuano has no dedicated TTS voice on any platform).

## Running
```bash
npm run web        # browser (port 8084)
npm start          # Expo Go on phone/tablet
```

## Building APK
```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
npx expo prebuild --platform android --no-install --clean
cd android && .\gradlew.bat assembleRelease
adb install -r app\build\outputs\apk\release\app-release.apk
```

## Testing (Maestro)
Maestro installed at `%USERPROFILE%\maestro\bin\maestro`
```bash
maestro test .maestro/
```
