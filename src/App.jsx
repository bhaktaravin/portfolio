import Header from './components/header/Header';
import Nav from './components/nav/Nav';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Skill from './components/skills/Skill';
import Resume from './components/resume/Resume';
import Testimonials from './components/testimonials/Testimonials';
function App() {
  return (
    <div className="App">
      <Header />
      <Resume />
      <Nav />
      <Testimonials />
      <About />
      <Skill />
      <Contact />

    </div>
  );
}

export default App;
