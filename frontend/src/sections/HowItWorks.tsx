import { motion } from 'framer-motion';

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-violet-400">How it works</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-50">Simple. Powerful. Effective.</h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Get started in minutes, not days. Our intuitive setup gets your team up and running fast.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <span className="text-violet-400 text-2xl font-bold">01</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Import your data</h3>
            <p className="text-center text-zinc-400">
              Connect your existing tools or import CSV files to centralize all customer information in one place.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <span className="text-violet-400 text-2xl font-bold">02</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Automate workflows</h3>
            <p className="text-center text-zinc-400">
              Set up automated follow-ups, task assignments, and notifications based on customer behavior and sales stages.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <span className="text-violet-400 text-2xl font-bold">03</span>
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Close more deals</h3>
            <p className="text-center text-zinc-400">
              Get real-time insights and analytics to identify opportunities, forecast revenue, and optimize your sales process.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}