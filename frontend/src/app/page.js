"use client";

import { useState } from "react";
import Astrolabe from "@/components/Astrolabe/Astrolabe";
import CanopyCanvas from "@/components/CanopyCanvas/CanopyCanvas";
import ChronicleDrawer from "@/components/ChronicleDrawer/ChronicleDrawer";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);

  const handleCommitClick = (commit) => {
    setSelectedCommit(commit);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <main>
      <Astrolabe />
      <CanopyCanvas onCommitClick={handleCommitClick} />
      <ChronicleDrawer
        isOpen={isDrawerOpen}
        commitData={selectedCommit}
        onClose={handleCloseDrawer}
      />
    </main>
  );
}
