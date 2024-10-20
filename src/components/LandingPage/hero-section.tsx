import React from "react";
import { cn } from "@/lib/utils";
import { gilroyBold } from "@/lib/utils";
import Link from "next/link";
import HeroHeaderSection from "./Hero-Header";
import MainButton from "../global/MainButton";
import { BackgroundBeams } from "../ui/background-beams";
import { ZapIcon } from "lucide-react";

function HeroSection() {
  return (
    <section className="  mt-16 items-center justify-center">
      <HeroHeaderSection />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div
          className={cn(
            gilroyBold.className,
            "text-4xl md:text-[92px] text-center text-white md:leading-[5.5rem] my-8"
          )}
        >
          Streamlined <br /> <span className="text-orange-500">Project Management</span>
        </div>

        <p className="mb-8 text-[22px] text-center text-white">
          Boost your team&apos;s productivity with TaskFlow. Our intuitive platform makes it easy 
          to plan, track, and manage projects of any size, all in one place.
        </p>

        <div className="flex gap-[12px] justify-center">
          <Link href="/sign-in">
            <MainButton
              text="Go to console"
              size="small"
              className="border-none rounded-[12px]"
            />
          </Link>
          <Link href="/sign-up">
            <MainButton
              text={<p className="flex text-black group-hover:text-orange-500">Get Started!<ZapIcon className="size-3.5 ml-1.5 text-orange-500 fill-orange-500 group-hover:text-white" /></p>}
              size="small"
              className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-white hover:bg-white text-[#31373D]"
            />
          </Link>
        </div>
      </div>
     
    </section>
  );
}

export default HeroSection;
