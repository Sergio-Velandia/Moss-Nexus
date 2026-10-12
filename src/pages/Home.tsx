import { Anatomy } from '../components/home/Anatomy'
import { Ecosystem } from '../components/home/Ecosystem'
import { Featured } from '../components/home/Featured'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'
import { PopularTools } from '../components/home/PopularTools'
import { Problem } from '../components/home/Problem'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Home() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Featured />
      <PopularTools />
      <Anatomy />
      <Ecosystem />
    </>
  )
}
