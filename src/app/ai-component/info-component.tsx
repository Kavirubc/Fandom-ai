"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { info } from "../schema/info";

export const InfoComponent = ({ info }: { info?: info }) => {
  const [showDescription, setshowDescription] = useState(false);
  return (
    <div className="bg-neutral-100 p-4 rounded-md m-4 max-w-prose flex items-center justify-between">
      <p>{showDescription ? info?.description : info?.title}</p>
      <Button
        onClick={() => setshowDescription(true)}
        disabled={showDescription}
        variant="outline"
      >
        Show Punchline!
      </Button>
    </div>
  );
};
