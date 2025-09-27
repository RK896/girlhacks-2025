# Microphone Troubleshooting Guide

If you're experiencing "failed to access microphone" errors, follow these troubleshooting steps:

## Quick Fixes

### 1. **Check Browser Permissions**
- Look for a microphone icon in your browser's address bar
- Click it and select "Allow" for microphone access
- Refresh the page after granting permission

### 2. **Use HTTPS**
- Voice recording requires HTTPS (secure connection)
- If you're on `http://localhost`, try `https://localhost` or use a service like ngrok
- For production, ensure your site uses HTTPS

### 3. **Browser Compatibility**
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Requires macOS 14.1+ or iOS 14.5+
- **Mobile browsers**: May have limited support

## Detailed Troubleshooting

### Error: "NotAllowedError"
**Cause**: User denied microphone permission or browser blocked access

**Solutions**:
1. Click the microphone icon in the address bar and select "Allow"
2. Go to browser settings → Privacy → Site Settings → Microphone
3. Find your site and set to "Allow"
4. Refresh the page

### Error: "NotFoundError"
**Cause**: No microphone detected

**Solutions**:
1. Check if microphone is connected
2. Try a different microphone
3. Check system audio settings
4. Restart browser

### Error: "NotReadableError"
**Cause**: Microphone is being used by another application

**Solutions**:
1. Close other applications using the microphone (Zoom, Teams, etc.)
2. Check if another browser tab is using the microphone
3. Restart browser

### Error: "NotSupportedError"
**Cause**: Browser doesn't support voice recording

**Solutions**:
1. Update your browser to the latest version
2. Try a different browser (Chrome recommended)
3. Check if you're using a supported operating system

## Browser-Specific Instructions

### Chrome
1. Click the lock icon in the address bar
2. Set Microphone to "Allow"
3. Refresh the page

### Firefox
1. Click the shield icon in the address bar
2. Click "Permissions" → "Microphone"
3. Set to "Allow"
4. Refresh the page

### Safari
1. Safari → Preferences → Websites → Microphone
2. Find your site and set to "Allow"
3. Refresh the page

## System-Level Fixes

### Windows
1. Settings → Privacy → Microphone
2. Ensure "Allow apps to access your microphone" is ON
3. Check if your browser is listed and enabled

### macOS
1. System Preferences → Security & Privacy → Privacy → Microphone
2. Check if your browser is listed and enabled
3. Restart browser if needed

### Linux
1. Check PulseAudio is running: `pulseaudio --check`
2. Verify microphone permissions in browser
3. Try different audio input device

## Development Environment

### Local Development
If testing locally, you may need to use HTTPS:

```bash
# Using ngrok (recommended)
npx ngrok http 3000

# Using mkcert for local HTTPS
mkcert localhost 127.0.0.1 ::1
# Then configure your dev server to use HTTPS
```

### Production Deployment
Ensure your production site uses HTTPS:
- Let's Encrypt for free SSL certificates
- Cloudflare for easy HTTPS setup
- Your hosting provider's SSL options

## Testing Microphone Access

You can test if your microphone works by visiting:
- https://www.onlinemictest.com/
- https://webcamtests.com/microphone-test

## Still Having Issues?

1. **Try a different browser** (Chrome usually works best)
2. **Check system audio settings** - ensure microphone is not muted
3. **Restart your browser** completely
4. **Check for browser extensions** that might block microphone access
5. **Try incognito/private mode** to rule out extension conflicts

## Common Solutions Summary

| Issue | Solution |
|-------|----------|
| Permission denied | Allow microphone in browser settings |
| No microphone found | Check hardware connection |
| Microphone in use | Close other apps using microphone |
| Not supported | Update browser or try different browser |
| HTTPS required | Use HTTPS for your site |
| Local development | Use ngrok or local HTTPS setup |

If none of these solutions work, the issue might be with your specific hardware or system configuration. In that case, you can still use the text input method for journal entries.
