import { AnimatedBackground } from "animated-backgrounds";
import React from "react";
import About from "./src/components/about/About";
import Contact from "./src/components/contact/Contact";
import Header from "./src/components/header/Header";
import Nav from "./src/components/nav/Nav";
import Portfolio from "./src/components/portfolio/Portfolio";
import Skill from "./src/components/skills/Skill";
import Testimonials from "./src/components/testimonials/Testimonials";

// Replace this with an actual Unsplash URL or use a dynamic fetching function
const unsplashUrl = "https://unsplash.com/photos/a-galaxy-in-space-zIUT8p0T9-A"; // Example URL

function App() {
  return (
    <div className="App">
      <AnimatedBackground animationName="starryNight" />
      <Nav />
      <Header />
      <About />
      <Testimonials />
      <Portfolio />
      <Skill />
      <Contact />
    </div>
  );
}

export default App;
