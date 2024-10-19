
import DashboardSection from "@/components/LandingPage/dashboard-section";
import HeroSection from "@/components/LandingPage/hero-section";
import {LandingNavbar} from "@/components/LandingPage/landing-navbar";

export default  function Home() {
  

  return (
    <div className="bg-black  w-screen">
      <LandingNavbar />
      <HeroSection />
      <DashboardSection />
    </div>
  )
}
