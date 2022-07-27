import Header from './components/header/Header';
import Nav from './components/nav/Nav';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Skill from './components/skills/Skill';
import Testimonials from './components/testimonials/Testimonials';
import Portfolio from './components/portfolio/Portfolio';
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
