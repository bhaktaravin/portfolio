import Header from './src/components/header/Header';
import Nav from './src/components/nav/Nav';
import About from './src/components/about/About';
import Contact from './src/components/contact/Contact';
import Skill from './src/components/skills/Skill';
import Testimonials from './src/components/testimonials/Testimonials';
import Portfolio from './src/components/portfolio/Portfolio';



function App() {
  return (
    <div className="App">
      <Header />
      <Nav />
      <About />
      <Testimonials />
      <Portfolio />
      <Skill />
      <Contact />
      
    </div>
  );
}

export default App;
