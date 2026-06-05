import HomeHeader from "./components/HomeHeader";
import HomeHero from "./components/HomeHero";
import HomeWorks from "./components/HomeWorks";
import HomeQuickMenu from "./components/HomeQuickMenu";
import HomeFooter from "./components/HomeFooter";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <HomeHero />
      <HomeWorks />
      <HomeQuickMenu />
      <HomeFooter />
    </>
  );
}
