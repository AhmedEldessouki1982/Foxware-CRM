import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Perfect for small teams getting started',
    features: ['Up to 1,000 contacts', 'Basic email tracking', 'Web forms', 'Community support'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'For growing businesses',
    features: ['Unlimited contacts', 'Advanced automation', 'Custom reporting', 'Integrations API', 'Priority support'],
    cta: 'Start free trial',
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Unlimited everything', 'Dedicated account manager', 'SLA guarantee', 'SSO / SAML', 'Custom contracts', 'On-premise deployment'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-violet-400">Pricing</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-50">Simple, transparent pricing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`relative h-full rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-2 border-violet-400 bg-violet-950/20'
                  : 'border border-zinc-800 bg-zinc-900'
              }`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full bg-violet-500 text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-violet-100' : 'text-zinc-400'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-violet-100' : 'text-zinc-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-violet-400' : 'text-emerald-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-xl font-semibold h-11 ${
                    plan.highlighted
                      ? 'bg-violet-500 text-white hover:bg-violet-400'
                      : 'bg-zinc-800 text-zinc-50 hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}