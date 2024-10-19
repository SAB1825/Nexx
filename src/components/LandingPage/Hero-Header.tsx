import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function HeroHeaderSection() {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 bg-[#F4F5F6] p-1 rounded-[100px] pr-[10px]">
        <div className="text-white inline-block bg-primary p-2 rounded-[100px] text-[10px] font-semibold">
          New
        </div>
        <p className="text-[#31373D]">
          Manage your projects in ease!
        </p>
        <Link href="/sign-in">
        <div className="cursor-pointer">
          <ChevronRight />
        </div>
        </Link>
      </div>
    </div>
  );
}

export default HeroHeaderSection;