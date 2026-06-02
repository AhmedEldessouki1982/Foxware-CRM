import { motion } from 'framer-motion';

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-violet-400">What our customers say</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-50">Trusted by thousands of businesses</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <span className="text-violet-400 font-bold">JD</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50">Jessica Doe</h3>
                <p className="text-sm text-zinc-400">Sales Manager, TechCorp</p>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              "CustomerFlow has transformed how we manage customer relationships. Our team is more aligned, and we've seen a 30% increase in closed deals since implementation."
            </p>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <span className="text-violet-400 font-bold">MK</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50">Michael Kim</h3>
                <p className="text-sm text-zinc-400">Founder, StartupXYZ</p>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              "The automation features saved us countless hours of manual work. Now we can focus on what matters most - building relationships with our customers."
            </p>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                <span className="text-violet-400 font-bold">SR</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50">Sarah Reynolds</h3>
                <p className="text-sm text-zinc-400">Director of Operations, Global Inc</p>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              "CustomerFlow scaled with us from 10 to 10,000 customers without missing a beat. The reliability and performance are unmatched in the market."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}