# Hanime Stremio Addon (Personal)

A simple **personal** Stremio addon for [hanime.tv](https://hanime.tv).

This addon allows you to browse and stream hentai/anime content directly inside Stremio.

> ⚠️ **Note**: This is built for **personal use only**. It requires a valid Hanime.tv account.

## Features

- Browse **Trending**, **Recent**, and **Most Views** catalogs
- Search support
- Stream videos in multiple qualities
- Easy configuration via Stremio
- Deployed on Vercel (serverless & free)

## Installation

### 1. Deploy to Vercel (Recommended)

1. Push this project to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Click **Deploy**

After deployment, copy your manifest URL (it will look like `https://your-project.vercel.app/manifest.json`).

### 2. Add to Stremio

1. Open **Stremio**
2. Go to **Add-ons** (puzzle icon)
3. Paste your Vercel manifest URL
4. Click **Install**

### 3. Configure the Addon

1. After installing, click **Configure** on the addon
2. Enter your **Hanime.tv Email**
3. Enter your **Hanime.tv Password**
4. Click **Save**

The addon will now work with your account.

## Important Notes

- You **must** have a Hanime.tv account to use this addon (streams require login).
- This addon is designed for **personal use** only.
- All credentials are stored securely inside Stremio and only sent to Hanime.tv.
- The addon uses serverless functions on Vercel (free for personal use).

## Project Structure
