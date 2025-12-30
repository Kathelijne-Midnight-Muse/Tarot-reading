# Daily Tarot Companion

A beautiful React app for daily tarot readings using the Rider-Waite deck and Claude AI for personalized interpretations.

## Features

- **Three-Card Spread**: Past, Present, Future readings
- **Upright/Reversed Orientations**: Choose the orientation of each card
- **AI-Powered Readings**: Uses Claude Sonnet to generate personalized, meaningful readings
- **Reading History**: Save and revisit your past readings
- **Beautiful UI**: Gradient backgrounds, smooth animations, and responsive design
- **Local Storage**: All readings are saved in your browser

## Prerequisites

Before you begin, you'll need:

- Node.js (v16 or higher)
- pnpm (or npm/yarn)
- An Anthropic API key (get one at https://console.anthropic.com)

## Installation

1. **Clone the repository** (or download the files):
```bash
git clone https://github.com/YOUR_USERNAME/Tarot-reading.git
cd Tarot-reading
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

4. **Add your API key**:
   - Open `.env.local`
   - Replace `your_anthropic_api_key_here` with your actual Anthropic API key
   - Save the file

## Development

To run the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173/`

## Building for Production

To build the app for deployment:

```bash
pnpm build
```

This creates an optimized build in the `dist/` folder.

## Deploying to GitHub Pages

### Step 1: Push to GitHub

1. Initialize a git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/Tarot-reading.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - This will automatically detect the Vite configuration

### Step 3: Create GitHub Actions Workflow

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Step 4: Push and Deploy

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

Your app will be deployed to: `https://YOUR_USERNAME.github.io/Tarot-reading/`

## Important Security Note

**Never commit your `.env.local` file to GitHub!** It's already in `.gitignore`, but make sure:

1. Your API key is in `.env.local` (not `.env`)
2. You have `.env.local` in `.gitignore`
3. For GitHub Pages deployment, you have two options:

   **Option A: Use GitHub Secrets (Recommended)**
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_ANTHROPIC_API_KEY` as a secret
   - Update your workflow to use it:
   ```yaml
   - name: Build
     run: pnpm build
     env:
       VITE_ANTHROPIC_API_KEY: ${{ secrets.VITE_ANTHROPIC_API_KEY }}
   ```

   **Option B: Client-side API Key**
   - Users can provide their own API key in the app
   - Modify `App.jsx` to accept user input for the API key

## File Structure

```
tarot-reading-app/
├── src/
│   ├── App.jsx           # Main component
│   ├── App.css           # Component styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/
│   └── vite.svg          # Vite logo
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Customization

### Change the Base Path
If you want to deploy to a different path, update `vite.config.js`:
```javascript
base: '/your-custom-path/',
```

### Modify Card Data
Edit the `MAJOR_ARCANA` and `MINOR_ARCANA` arrays in `App.jsx` to customize the available cards.

### Change Styling
- Colors and gradients are defined in `App.jsx` with Tailwind classes
- Modify the gradient in the main container: `from-indigo-900 via-purple-900 to-indigo-800`

### Customize the AI Prompt
Edit the prompt in the `generateReading` function in `App.jsx` to change how the AI interprets the cards.

## Troubleshooting

### 404 Error on GitHub Pages
- Ensure `base: '/Tarot-reading/'` is set in `vite.config.js`
- Make sure the workflow deploys to the correct branch
- Check that GitHub Pages is enabled in repository settings

### API Key Not Working
- Verify the key is in `.env.local` (not `.env`)
- Check that the key is valid at https://console.anthropic.com
- Ensure the key has sufficient credits

### Build Fails
- Delete `node_modules` and `pnpm-lock.yaml`
- Run `pnpm install` again
- Try `pnpm build` with verbose output: `pnpm build --debug`

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Claude AI** - Reading generation
- **GitHub Pages** - Hosting

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Check Anthropic's documentation at https://docs.anthropic.com

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

---

**Enjoy your daily tarot readings! ✨**
