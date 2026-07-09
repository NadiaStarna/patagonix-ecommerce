import heroBg from '../../assets/login-bg.jpg'

const STARS = [
  { x: '8%', y: '15%', size: 2.5, delay: '0s', duration: '3s' },
  { x: '15%', y: '35%', size: 2, delay: '0.8s', duration: '4s' },
  { x: '25%', y: '12%', size: 3, delay: '1.5s', duration: '3.5s' },
  { x: '35%', y: '28%', size: 2, delay: '0.3s', duration: '4.5s' },
  { x: '45%', y: '18%', size: 2.5, delay: '2s', duration: '3s' },
  { x: '60%', y: '10%', size: 2, delay: '1s', duration: '4s' },
  { x: '70%', y: '22%', size: 3, delay: '0.5s', duration: '3.5s' },
  { x: '80%', y: '14%', size: 2.5, delay: '1.8s', duration: '4s' },
  { x: '90%', y: '30%', size: 2, delay: '0.2s', duration: '3s' },
  { x: '52%', y: '8%', size: 2, delay: '2.5s', duration: '4.5s' },
  { x: '12%', y: '45%', size: 2, delay: '1.2s', duration: '3.8s' },
  { x: '38%', y: '42%', size: 2.5, delay: '0.6s', duration: '4.2s' },
  { x: '65%', y: '40%', size: 2, delay: '2.2s', duration: '3.6s' },
  { x: '85%', y: '46%', size: 2.5, delay: '1.6s', duration: '4s' },
  { x: '5%', y: '52%', size: 2, delay: '0.4s', duration: '3.5s' },
  { x: '22%', y: '55%', size: 2.5, delay: '1.4s', duration: '4.3s' },
  { x: '50%', y: '50%', size: 2, delay: '2.1s', duration: '3.9s' },
  { x: '95%', y: '53%', size: 2.5, delay: '0.9s', duration: '4.1s' },
]

export const Hero = () => {
  return (
    <div className="overflow-hidden relative text-white">
      {/* Capa 1: la foto, como elemento propio, no como background del contenedor */}
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 30%', zIndex: 0 }}
      />

      {/* Capa 2: overlay de degradé de marca */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(180deg, rgba(74,46,74,0.75) 0%, rgba(176,90,58,0.5) 45%, rgba(43,46,51,0.65) 100%)',
        }}
      />

      {/* Capa 3: estrellas */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: star.x,
            top: star.y,
            width: `${star.size}px`,
            height: `${star.size}px`,
            zIndex: 2,
            boxShadow: '0 0 4px 1px rgba(255, 244, 214, 0.8)',
            animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}

      {/* Capa 4: contenido de texto */}
      <div className="relative max-w-7xl mx-auto px-8 md:px-16 py-8 md:py-12" style={{ zIndex: 3 }}>
        <h1 className="leading-none mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="block text-3xl md:text-5xl font-normal text-stone-100">Tu próxima</span>
          <span className="block text-6xl md:text-8xl font-bold text-white -mt-2">aventura</span>
          <span className="block text-4xl md:text-6xl font-normal italic text-amber-100 -mt-2">empieza acá.</span>
        </h1>

        <p className="text-sm md:text-base text-amber-100 font-medium mt-3 mb-4 max-w-sm leading-relaxed">
          Equipamiento outdoor y de trekking inspirado en las condiciones únicas de la Patagonia.
        </p>

        <a href="#catalogo" className="inline-block bg-sunset text-white px-7 py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition">Ver catalogo</a>
      </div>
    </div>
  )
}