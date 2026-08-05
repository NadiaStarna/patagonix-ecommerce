import { LandingHero } from './LandingHero'
import { LandingBenefits } from './LandingBenefits'
import { LandingCollections } from './LandingCollections'
import { FeaturedProducts } from '../common/FeaturedProducts'
import { LandingBanner } from './LandingBanner'
import { LandingWhyUs } from './LandingWhyUs'
import { LandingTestimonials } from './LandingTestimonials'

export const LandingPage = () => {
  return (
    <div>
      <LandingHero />
      <LandingBenefits />
      <LandingCollections />
      <FeaturedProducts />
      <LandingBanner />
      <LandingWhyUs />
      <LandingTestimonials />
    </div>
  )
}