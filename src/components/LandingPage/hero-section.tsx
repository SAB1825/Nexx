import React from "react";
import { cn } from "@/lib/utils";
import { gilroyBold } from "@/lib/utils";
import Link from "next/link";
import HeroHeaderSection from "./Hero-Header";
import MainButton from "../global/MainButton";
import { BackgroundBeams } from "../ui/background-beams";

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
          <Link href="/sign-up">
            <MainButton
              text="Start Free Trial"
              size="small"
              className="border-none rounded-[12px]"
            />
          </Link>
          <Link href="/product-tour">
            <MainButton
              text="Take a Tour"
              size="small"
              className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-white hover:bg-white text-[#31373D]"
            />
          </Link>
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
}

export default HeroSection;
