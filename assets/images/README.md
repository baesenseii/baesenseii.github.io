# Profile Picture Setup

## How to Add Your Profile Picture

1. **Prepare your image:**
   - Recommended size: 300x300 pixels or larger (square)
   - Format: JPG, PNG, or WebP
   - File should be relatively small (< 500KB)

2. **Name your image:**
   - Name it `profile.jpg` (or `profile.png`)

3. **Upload to this directory:**
   ```bash
   # Place your image here:
   /assets/images/profile.jpg
   ```

4. **Update the path in index.html:**
   The image is referenced in the right pane:
   ```html
   <img src="/assets/images/profile.jpg" alt="baesenseii" class="profile-picture">
   ```

## If Image Doesn't Load

If the profile picture doesn't load, the site will show a fallback placeholder with your initials "BS" in a circular container with the terminal green theme.

## Alternative: Use External URL

You can also use an external image URL:

```html
<img src="https://your-image-host.com/profile.jpg" alt="baesenseii" class="profile-picture">
```

## Styling

The profile picture has:
- Circular shape (border-radius: 50%)
- Green border matching the terminal theme
- Glow effect on hover
- 150x150px display size
- Automatic cropping to fit (object-fit: cover)
