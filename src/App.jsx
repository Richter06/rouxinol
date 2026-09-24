import Hero from './components/Hero'
import Solutions from './components/Solutions'
import Visibility from './components/Visibility'
import ThreeDStory from './components/ThreeDStory'
import Vitrine from './components/Vitrine'
import Stats from './components/Stats'
import Testimonial from './components/Testimonial'
import Pricing from './components/Pricing'
import Growth from './components/Growth'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Solutions />
        <Visibility />
        <ThreeDStory />
        <Vitrine />
        <Stats />
        <Testimonial />
        <Pricing />
        <Growth />
        <CTA />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  )
}