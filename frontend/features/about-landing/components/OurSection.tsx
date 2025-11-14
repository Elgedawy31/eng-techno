import OurImageAndText from './OurImage&Text'

export default function OurSection() {
  return (
    <div>
      <OurImageAndText 
      title='OUR MISSION' 
      text='To reinforce national defense capabilities by delivering
       state-of-the-art military equipment, innovative security solutions,
        and expert consultancy services that safeguard nations and support mission success.' 
      img='/our1.png'
      />
      <OurImageAndText 
      title='OUR VISION' 
      text='To be recognized as the world’s most trusted defense partner, 
      providing advanced solutions that empower military and law enforcement 
      agencies, while driving global stability and security.' 
      img='/our2.png'
      />
    </div>
  )
}
