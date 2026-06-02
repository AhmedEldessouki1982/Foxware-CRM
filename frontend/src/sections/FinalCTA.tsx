import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
          Ready to transform your customer relationships?
        </h2>
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          Join thousands of businesses that are already growing with CustomerFlow.
        </p>
        <Button size="lg" className="bg-violet-500 hover:bg-violet-400 text-white gap-2 h-12 px-10 rounded-xl font-semibold shadow-lg shadow-violet-500/25">
          Get started for free
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </section>
  );
}