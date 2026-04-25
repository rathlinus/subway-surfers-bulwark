/**
 * Subway Surfers - keeps your hands occupied while you write emails.
 *
 * Renders a portrait (9:21) YouTube embed of an hour-long Subway Surfers
 * gameplay video on the left of the New Message dialog. The video starts at
 * one of 10 random entry points (every 6 minutes) so the experience is
 * different every time you compose.
 *
 * Source video: https://youtu.be/zZ7AimPACzc
 */

const VIDEO_ID = "zZ7AimPACzc";

// One-hour video, 10 entry points spaced 6 minutes apart.
const ENTRY_POINTS_SECONDS = [
  0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240,
];

function buildEmbedUrl(startSec) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    start: String(startSec),
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    controls: "1",
    iv_load_policy: "3",
  });
  // Privacy-enhanced embed host - no tracking cookies until interaction.
  return (
    "https://www.youtube-nocookie.com/embed/" +
    VIDEO_ID +
    "?" +
    params.toString()
  );
}

function pickRandomStart() {
  const i = Math.floor(Math.random() * ENTRY_POINTS_SECONDS.length);
  return ENTRY_POINTS_SECONDS[i];
}

function SubwaySurfersSidebar() {
  const externals = globalThis.__PLUGIN_EXTERNALS__ || {};
  const React = externals.React;
  if (!React) return null;
  const { createElement: h, useMemo, useState } = React;

  // Pick the start time exactly once per composer mount so the sidebar
  // doesn't re-randomise on every re-render of the parent component.
  const startSec = useMemo(() => pickRandomStart(), []);
  const [src] = useState(() => buildEmbedUrl(startSec));

  const startMin = Math.round(startSec / 60);
  const label = startMin === 0 ? "from the top" : "+" + startMin + "m in";

  return h(
    "div",
    {
      style: {
        position: "relative",
        height: "100%",
        // 9:21 portrait - width is derived from the composer's height so the
        // gameplay fills the full vertical space without distortion.
        aspectRatio: "9 / 21",
        maxWidth: "380px",
        minWidth: "220px",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      },
    },
    h("iframe", {
      src: src,
      title: "Subway Surfers - gameplay",
      allow: "autoplay; encrypted-media; picture-in-picture",
      allowFullScreen: true,
      referrerPolicy: "no-referrer",
      loading: "lazy",
      style: {
        width: "100%",
        height: "100%",
        flex: "1 1 auto",
        border: 0,
        display: "block",
      },
    }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "6px 10px",
          fontSize: "11px",
          fontWeight: 500,
          color: "#fff",
          background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
          letterSpacing: "0.04em",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      h("span", null, "Subway Surfers"),
      h("span", { style: { opacity: 0.75 } }, label),
    ),
  );
}

export function activate(api) {
  const disposables = [];

  disposables.push(
    api.ui.registerComposerSidebar({
      id: "subway-surfers",
      label: "Subway Surfers",
      render: SubwaySurfersSidebar,
      order: 100,
    }),
  );

  api.log.info("Subway Surfers plugin activated");

  return {
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}
