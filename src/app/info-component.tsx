"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { info } from "./info";

export const InfoComponent = ({ info }: { info?: info }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  return (
    <div className="bg-neutral-100 p-4 rounded-md m-4 max-w-prose flex items-center justify-between">
      <p>{showPunchline ? info?.description : info?.title}</p>
      <Button
        onClick={() => setShowPunchline(true)}
        disabled={showPunchline}
        variant="outline"
      >
        Show Punchline!
      </Button>
    </div>
  );
};
