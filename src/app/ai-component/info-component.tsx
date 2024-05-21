"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { info } from "../schema/info";

export const InfoComponent = ({ info }: { info?: info }) => {
  const [showDescription, setshowDescription] = useState(false);
  return (
    <div className="bg-inherit backdrop-blur-md p-4 rounded-md m-4 max-w-prose flex items-center justify-between ">
      <p className="text-black">{showDescription ? info?.description : info?.title}</p>
      <Button
        onClick={() => setshowDescription(true)}
        disabled={showDescription}
        variant="outline"
        className="ml-4 border border-gray-300 text-black bg-white hover:bg-gray-100 focus:ring-2 focus:ring-violet-500 rounded-md"
      >
        Show fun-fact!
      </Button>
    </div>
  );
};
