const STARS = [
  { x: '8%', y: '15%', size: 2, delay: '0s', duration: '3s' },
  { x: '15%', y: '35%', size: 1.5, delay: '0.8s', duration: '4s' },
  { x: '25%', y: '12%', size: 2.5, delay: '1.5s', duration: '3.5s' },
  { x: '35%', y: '28%', size: 1.5, delay: '0.3s', duration: '4.5s' },
  { x: '45%', y: '18%', size: 2, delay: '2s', duration: '3s' },
  { x: '60%', y: '10%', size: 1.5, delay: '1s', duration: '4s' },
  { x: '70%', y: '22%', size: 2.5, delay: '0.5s', duration: '3.5s' },
  { x: '80%', y: '14%', size: 2, delay: '1.8s', duration: '4s' },
  { x: '90%', y: '30%', size: 1.5, delay: '0.2s', duration: '3s' },
  { x: '52%', y: '8%', size: 1.5, delay: '2.5s', duration: '4.5s' },
  { x: '12%', y: '45%', size: 1.5, delay: '1.2s', duration: '3.8s' },
  { x: '38%', y: '42%', size: 2, delay: '0.6s', duration: '4.2s' },
  { x: '65%', y: '40%', size: 1.5, delay: '2.2s', duration: '3.6s' },
  { x: '85%', y: '46%', size: 2, delay: '1.6s', duration: '4s' },
  { x: '5%', y: '52%', size: 1.5, delay: '0.4s', duration: '3.5s' },
  { x: '22%', y: '55%', size: 2, delay: '1.4s', duration: '4.3s' },
  { x: '50%', y: '50%', size: 1.5, delay: '2.1s', duration: '3.9s' },
  { x: '95%', y: '53%', size: 2, delay: '0.9s', duration: '4.1s' },
]

export const Hero = () => {
  return (
    <div
      className="overflow-hidden relative pt-6 pb-0 text-white"
      style={{ background: 'linear-gradient(180deg, #4A2E4A 0%, #B05A3A 45%, #2B2E33 100%)' }}
    >
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: star.x,
            top: star.y,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <h1 className="relative z-10 leading-none mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="block text-3xl md:text-5xl font-normal text-stone-100">Tu próxima</span>
          <span className="block text-6xl md:text-8xl font-bold text-white -mt-2">aventura</span>
          <span className="block text-4xl md:text-6xl font-normal italic text-amber-100 -mt-2">empieza acá.</span>
        </h1>

        <p className="relative z-10 text-sm md:text-base text-amber-100 font-medium mt-3 mb-4 max-w-sm leading-relaxed">
          Equipamiento outdoor y de trekking inspirado en las condiciones únicas de la Patagonia.
        </p>

        <a href="#catalogo" className="relative z-10 inline-block bg-sunset text-white px-7 py-3 rounded-lg text-sm font-semibold mb-8 hover:bg-opacity-90 transition">Ver catalogo</a>
      </div>

      <svg viewBox="0 0 700 320" className="absolute bottom-0 left-0 w-full h-48 z-0" preserveAspectRatio="none">
        <polygon points="0,320 0,220 90,180 160,230 230,160 700,200 700,320" fill="#3A2A35" opacity="0.5" />
        <polygon points="380,320 380,10 440,130 480,70 540,200 700,140 700,320" fill="#211A22" />
        <polygon points="440,130 460,148 470,118 440,130" fill="#F0CDA0" opacity="0.5" />
        <polygon points="0,320 0,250 130,210 230,260 320,200 700,240 700,320" fill="#1A141B" />
      </svg>
    </div>
  )
}