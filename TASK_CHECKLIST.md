## Task Checklist - PR #45 / task_29 Branch

### Current Status:
- Branch: task_29 (current working branch)
- PR URL: https://github.com/QuasarApp/site/pull/45

### Issues Fixed (from EndrII's feedback):
1. **Hero Section Background** - FIXED:
   - Added proper centering for parallax background image using `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`
   - Updated CSS class `.parallax-bg-img` to center the image properly
   - Added blur effect (12px) to hide artifacts from image stretching
   - Used `object-fit: contain` to prevent image distortion

2. **Ecliptica Project Card** - FIXED:
   - Added game logo (ecliptica_icon_logo.png) with proper styling
   - Added background image from the game (ecliptica_background.jpg) via CSS `::before` pseudo-element
   - Removed duplicate `.card-background` CSS rules (consolidated to `::before`)
   - Card has proper glow effect with hover transitions
   - No GitHub link (as Ecliptica is not available on GitHub)

3. **Wishlist Button** - ALREADY CORRECT:
   - Links to Steam wishlist page: `https://store.steampowered.com/app/3723390/Ecliptica/wishlist/`

4. **Hero Section Content** - VERIFIED:
   - Contains game information about Ecliptica
   - Ecliptica featured banner with proper integration

### Assets Available:
- ecliptica_header.jpg - Hero background
- ecliptica_icon_logo.png - Game logo
- ecliptica_capsule.jpg - Game capsule (horizontal)
- ecliptica_capsula_vertical.png - Game capsule (vertical)
- ecliptica_background.jpg - Project card background

### Notes:
- Ecliptica is NOT available on GitHub - all GitHub links removed from Ecliptica cards
- EndrII suggested checking the game website: https://ecliptica.me/ for animations/elements