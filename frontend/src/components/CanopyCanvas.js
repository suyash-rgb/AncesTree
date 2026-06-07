"use client";

import CornerAccent from "./CornerAccent";
import DummyTree from "./DummyTree";

export default function CanopyCanvas({ onCommitClick }) {
  return (
    <div className="relative flex-1 overflow-auto bg-canvas">
      <CornerAccent position="top-left" />
      <CornerAccent position="top-right" />
      <CornerAccent position="bottom-left" />
      <CornerAccent position="bottom-right" />

      <div className="min-h-full p-8">
        <DummyTree onCommitClick={onCommitClick} />
      </div>
    </div>
  );
}
