import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqItems = [
  {
    value: 'integration',
    question: 'How does CustomerFlow integrate with my existing tools?',
    answer: 'CustomerFlow offers native integrations with popular tools like Slack, Zoom, Mailchimp, and QuickBooks. We also provide a powerful API and webhook system for custom integrations with any other tools your team uses.',
  },
  {
    value: 'security',
    question: 'Is my data secure and compliant with regulations?',
    answer: 'Yes, we take data security seriously. CustomerFlow is GDPR, CCPA, and SOC 2 compliant. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Regular security audits and penetration testing are performed to ensure the highest level of protection.',
  },
  {
    value: 'pipeline',
    question: 'Can I customize the sales pipeline stages?',
    answer: 'Absolutely! Our pipeline is fully customizable. You can create custom stages, set probabilities, and automate actions based on stage changes. This allows you to match your unique sales process perfectly.',
  },
  {
    value: 'support',
    question: 'What kind of support and training is available?',
    answer: 'We provide comprehensive onboarding, video tutorials, documentation, and responsive customer support. Professional plan customers get priority support, while Enterprise customers receive a dedicated customer success manager and customized training sessions.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-widest uppercase text-violet-400">
            Frequently asked questions
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-50">
            Get the answers you need
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item) => (
              <AccordionItem key={item.value} value={item.value} className="border border-zinc-800 rounded-lg bg-zinc-900 px-6">
                <AccordionTrigger className="text-zinc-50 hover:no-underline py-4">
                  <h3 className="text-lg font-semibold text-left">{item.question}</h3>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}