import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, BarChart3, Globe, Lock, Sparkles } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', description: 'Instantly load customer data and respond in real-time.' },
  { icon: Shield, title: 'Enterprise Security', description: 'Advanced encryption and compliance with GDPR, SOC 2.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep insights into customer behavior and sales trends.' },
  { icon: Globe, title: 'Global Scale', description: 'Multi-language support and data centers worldwide.' },
  { icon: Lock, title: 'Privacy First', description: 'Full control over data sharing and customer consent.' },
  { icon: Sparkles, title: 'AI Powered', description: 'Predictive lead scoring and automated follow-ups.' },
];

const container = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="features" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-violet-400">Features</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-50">Everything you need to manage customer relationships</h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">Powerful features designed to help you close more deals and keep customers happy.</p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={item}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-violet-500/30 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-zinc-50 mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}