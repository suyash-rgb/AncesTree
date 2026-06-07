const cornerStyles = {
  "top-left": {
    top: 0,
    left: 0,
    borderTop: "2px solid rgba(207, 175, 99, 0.4)",
    borderLeft: "2px solid rgba(207, 175, 99, 0.4)",
    borderRadius: "12px 0 0 0",
  },
  "top-right": {
    top: 0,
    right: 0,
    borderTop: "2px solid rgba(207, 175, 99, 0.4)",
    borderRight: "2px solid rgba(207, 175, 99, 0.4)",
    borderRadius: "0 12px 0 0",
  },
  "bottom-left": {
    bottom: 0,
    left: 0,
    borderBottom: "2px solid rgba(207, 175, 99, 0.4)",
    borderLeft: "2px solid rgba(207, 175, 99, 0.4)",
    borderRadius: "0 0 0 12px",
  },
  "bottom-right": {
    bottom: 0,
    right: 0,
    borderBottom: "2px solid rgba(207, 175, 99, 0.4)",
    borderRight: "2px solid rgba(207, 175, 99, 0.4)",
    borderRadius: "0 0 12px 0",
  },
};

export default function CornerAccent({ position = "top-left" }) {
  return <div className="ui-corner-accent" style={cornerStyles[position] || cornerStyles["top-left"]} />;
}
