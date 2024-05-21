"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { link } from "../schema/link";
import Link from "next/link";
import { ArrowUpRight, Dice1, MoveUpRight, SquareArrowOutUpRight } from "lucide-react";

export const LinkComponent = ({ link }: { link?: link }) => {


    function handleLink() {
        window.open(link?.link, "_blank");
    }

    const [showDescription, setshowDescription] = useState(false);
    return (
        <div className="bg-inherit backdrop-blur-md p-4 rounded-md m-4 max-w-prose flex items-center justify-between ">
            {showDescription ? (
                <div className="flex flex-col items-start">
                 {link?.description}
                 
                    <button className="flex flex-row gap-2 items-center text-blue-800 border px-4 py-1 mt-1 hover:bg-slate-100 transition-colors duration-300 bg-white rounded-xl" onClick={handleLink}>
                        Link <ArrowUpRight size={18} />
                    </button>
                </div>
                
            ) : (
                <p className="text-black">{link?.title}</p>
            )}
            <Button
                onClick={() => setshowDescription(true)}
                disabled={showDescription}
                variant="outline"
                className={`ml-4 border border-gray-300 text-black bg-white hover:bg-gray-100 focus:ring-2  focus:ring-violet-500 rounded-md ${showDescription ? 'hidden' : ''}`}
            >
                Show Link!
            </Button>
        </div>
    );
};
