import { ThreeRoot } from "@/components/three/ThreeRoot";
import { Cursor } from "@/components/ui/Cursor";
import { StageDots } from "@/components/ui/StageDots";
import { Preloader } from "@/components/sections/Preloader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Approach } from "@/components/sections/Approach";
import { Work } from "@/components/sections/Work";
import { Why } from "@/components/sections/Why";
import { Results } from "@/components/sections/Results";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Cursor />
      <StageDots />
      <Nav />
      <ThreeRoot>
        <main id="main">
          <Hero />
          <TrustedBy />
          <Intro />
          <Services />
          <Approach />
          <Work />
          <Why />
          <Results />
          <Testimonials />
          <FinalCta />
        </main>
        <Footer />
      </ThreeRoot>
    </>
  );
}
