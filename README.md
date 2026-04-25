# Subway Surfers

> Writing emails is boring - it doesn't have to be.

A Bulwark Webmail plugin that drops a Subway Surfers gameplay sidebar into the **New Message** dialog. Every time you open the composer, the sidebar picks a random 6-minute jump-in point from a one-hour gameplay video so it's never the same scene twice.

The video stays muted by default (browser autoplay policy + courtesy to your coworkers). Click the YouTube controls to unmute.

## How it works

The plugin registers a single UI slot - `composer-sidebar` - that the webmail renders on the left edge of the composer modal. The render component is a portrait-aspect (9:21) `<iframe>` pointed at the YouTube embed for [`zZ7AimPACzc`](https://youtu.be/zZ7AimPACzc) with a `start` query parameter set to one of:

| Entry point | seconds |
| ----------- | ------- |
| 0:00        | 0       |
| 6:00        | 360     |
| 12:00       | 720     |
| 18:00       | 1080    |
| 24:00       | 1440    |
| 30:00       | 1800    |
| 36:00       | 2160    |
| 42:00       | 2520    |
| 48:00       | 2880    |
| 54:00       | 3240    |

The pick happens once per composer mount, so re-renders within the same compose session don't restart the video.

## Permissions

- `ui:composer-sidebar` - register a panel inside the composer modal.

That's it. No email reads, no network access, no data exfiltration.

## Frame origins

The plugin embeds a `<iframe>` pointed at YouTube's privacy-enhanced host, so the manifest declares:

```json
"frameOrigins": ["https://www.youtube-nocookie.com"]
```

Bulwark validates this list at install time (https-only, single-origin form, no paths/queries) and merges it into the host CSP `frame-src`. Invalid entries are silently dropped — they never reach the CSP.

## Files

```
subway-surfers/
├── manifest.json   # plugin metadata
├── index.js        # entrypoint - exports activate(api)
├── src/
│   └── index.js    # source mirror (re-exports the entrypoint)
└── README.md
```

## Requires

- Bulwark Webmail **1.5.2** or later - the version that introduces the `composer-sidebar` slot and the `ui:composer-sidebar` permission.

## Hidden on mobile

The composer goes full-screen on mobile and there's no room for a side panel, so the slot's wrapper carries `hidden md:flex`. The plugin only appears at desktop widths.

## License

AGPL-3.0-only - same as the webmail.
