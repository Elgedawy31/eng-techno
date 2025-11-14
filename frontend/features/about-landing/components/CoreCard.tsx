interface CoreCardProp {
  title: string;
  text: string;
}
export default function CoreCard({title, text}: CoreCardProp) {
  return (
    <div className='border-t py-4 border-[#808285]'>
      <h1 className="text-3xl mb-2 font-heading">{title}</h1>
      <p className="text-xl text-[#808285] font-medium">{text}</p>
    </div>
  )
}
