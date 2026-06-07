"use client";

import { useState } from "react";
import Astrolabe from "@/components/Astrolabe";
import CanopyCanvas from "@/components/CanopyCanvas";
import ChronicleDrawer from "@/components/ChronicleDrawer";

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
    <div className="flex flex-col min-h-screen">
      <Astrolabe />
      <CanopyCanvas onCommitClick={handleCommitClick} />
      <ChronicleDrawer
        isOpen={isDrawerOpen}
        commitData={selectedCommit}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
