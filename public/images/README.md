# 📸 Local Images for Prativa's Birthday Site

Drop your photos here using the filenames below, and the site will use them automatically.

## How it works

The site looks for images at `/images/<filename>` (because Vite serves the `public/` folder at the root URL). Any file you put in this folder becomes available at `http://localhost:3000/images/<filename>`.

## Naming convention

Use these exact filenames so the site picks them up automatically. You can use **`.jpg`, `.jpeg`, `.png`, or `.webp`**.

| File               | Where it appears                                          | Size guide     |
| ------------------ | --------------------------------------------------------- | -------------- |
| `hero.jpg`         | Parallax background in the **Hero** section (top of page) | wide, ~1200px+ |
| `gallery-01.jpg`   | Gift card #1 (wide, top of gallery)                       | ~900px wide    |
| `gallery-02.jpg`   | Gift card #2                                              | ~600px wide    |
| `gallery-03.jpg`   | Gift card #3                                              | ~600px wide    |
| `gallery-04.jpg`   | Gift card #4                                              | ~600px wide    |
| `gallery-05.jpg`   | Gift card #5                                              | ~600px wide    |
| `gallery-06.jpg`   | Gift card #6 (video slot — used as a static fallback)     | ~600px wide    |
| `gallery-07.jpg`   | Gift card #7                                              | ~600px wide    |
| `gallery-08.jpg`   | Gift card #8                                              | ~600px wide    |
| `gallery-09.jpg`   | Gift card #9 (wide)                                       | ~900px wide    |
| `gallery-10.jpg`   | Gift card #10                                             | ~600px wide    |
| `gallery-11.jpg`   | Gift card #11 (video slot — static fallback)              | ~600px wide    |
| `gallery-12.jpg`   | Gift card #12                                             | ~600px wide    |
| `gallery-13.jpg`   | Gift card #13                                             | ~600px wide    |
| `gallery-14.jpg`   | Gift card #14                                             | ~600px wide    |
| `gallery-15.jpg`   | Gift card #15 (video slot — static fallback)              | ~900px wide    |
| `gallery-16.jpg`   | Gift card #16                                             | ~600px wide    |
| `gallery-17.jpg`   | Gift card #17                                             | ~600px wide    |
| `gallery-18.jpg`   | Gift card #18                                             | ~600px wide    |
| `gallery-19.jpg`   | Gift card #19                                             | ~600px wide    |
| `gallery-20.jpg`   | Gift card #20                                             | ~600px wide    |
| `gallery-21.jpg`   | Gift card #21 (video slot — static fallback)              | ~900px wide    |
| `gallery-22.jpg`   | Gift card #22 (last)                                      | ~600px wide    |
| `final-poster.jpg` | Poster image for the **Final Video** section              | wide, ~1200px+ |

> 💡 **You don't have to use all 22!** The site has a graceful fallback — if a file is missing, the original Unsplash photo is used instead. So you can add just a few favourites and leave the rest.

## Videos (optional)

If you want a real local video for the Final Video section, drop a `.mp4` here:

```
public/videos/final.mp4
```

If absent, the site keeps the current Pixabay clip.

## Tips

- **Compress your photos first** — large files slow the site down. A free tool like [squoosh.app](https://squoosh.app) works great.
- **Format**: `.webp` or `.jpg` with quality 80 is a good balance.
- **Orientation**: portrait photos work great in the masonry grid (the columns-2 layout).

## Don't want to bother with naming?

You can also edit the `MEDIA` array in `src/routes/index.tsx` and point any `src` to a custom path like `/images/your-filename.jpg`.
