export function LogoStrip() {
  const logos = ['TechCorp', 'Global Inc', 'StartupXYZ', 'Enterprise Ltd', 'Digital Solutions'];
  
  return (
    <div className="py-12 border-y border-zinc-800 bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-zinc-500 mb-8 tracking-widest uppercase">Trusted by teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map(logo => (
            <span key={logo} className="text-lg font-bold text-zinc-600 hover:text-zinc-400 transition-colors duration-200">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}