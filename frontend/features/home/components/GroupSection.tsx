import ImageAndText from './Image&Text'
import Manufacturing from './Manufacturing'

export default function GroupSection() {
  return (
    <div className='flex h-screen'>
      <div className="flex-1">
      <ImageAndText title="SOLUTIONS" text1="PROVEN POWER." text2='BATTLE-TESTED SOLUTIONS.' bgUrl={'/solutions-bg.png'}/>
      </div>
      <div className="flex-2">
        <Manufacturing />
      </div>
      <div className="flex-1">
      <ImageAndText title="LOGISTICS" text1="ENGINEERED FOR" text2='UNINTERRUPTED SUPPLY.' bgUrl={'/logistics-bg.png'}/>
      </div>
    </div>
  )
}
