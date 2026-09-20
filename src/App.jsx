import Hero from './components/Hero'
import Needs from './components/Needs'
import Solutions from './components/Solutions'
import Visibility from './components/Visibility'
import ThreeDStory from './components/ThreeDStory'
import Growth from './components/Growth'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />

        <Needs />

        <Solutions />

        <Visibility />

        <ThreeDStory />

        <Growth />

        <Pricing />

        <FAQ />

        <Contact />
      </main>

      <Footer />
    </>
  )
}