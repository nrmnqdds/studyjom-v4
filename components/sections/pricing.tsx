"use client";

import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import GridPattern from "../magicui/grid-pattern";

const pricingPlans = [
  {
    name: "Starter",
    description: "Start with essential perks to get familiar with StudyJom.",
    monthlyPrice: 0,
    annualPrice: 0,
    link: "https://github.com/ansub/syntaxUI",
    features: [
      "Limited to 10 notes to download",
      "Limited to 10 notes to upload",
      "5 PDF chat sessions per day",
    ],
  },
  {
    name: "Professional",
    description:
      "Unlock enhanced features and premium content to supercharge your study game.",
    monthlyPrice: 20,
    annualPrice: 220,
    link: "https://github.com/ansub/syntaxUI",
    features: [
      "Everything in Starter plan",
      "Unlimited notes to download",
      "Unlimited notes to upload",
      "Unlimited PDF chat sessions",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Ultimate customization and dedicated support for enterprises.",
    monthlyPrice: "?",
    annualPrice: "?",
    link: "https://github.com/ansub/syntaxUI",
    features: ["Need custom domain? Make it yours? Contact us!"],
  },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"M" | "A">("M");

  const Heading = () => (
    <div className="relative my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Fair pricing, unfair advantage.
        </p>
        <p className="text-md max-w-xl text-black md:text-center">
          Get started with StudyJom today and take your study notes to the next
          level.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingCycle("M")}
          type="button"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium ",
            billingCycle === "M"
              ? "relative bg-red-500 text-white "
              : "text-black hover:bg-red-100"
          )}
        >
          Monthly
          {billingCycle === "M" && <BackgroundShift shiftKey="monthly" />}
        </button>
        <button
          onClick={() => setBillingCycle("A")}
          type="button"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium ",
            billingCycle === "A"
              ? "relative bg-red-500 text-white "
              : "text-black hover:bg-red-100"
          )}
        >
          Annual
          {billingCycle === "A" && <BackgroundShift shiftKey="annual" />}
        </button>
      </div>
    </div>
  );

  const PricingCards = () => (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className="bg-green-300 w-full rounded-xl border-2 border-black shadow-default-md p-6 text-left"
        >
          <p className="mb-1 mt-0 text-sm font-medium uppercase text-red-500">
            {plan.name}
          </p>
          <p className="my-0 mb-6 text-sm text-gray-600">{plan.description}</p>
          <div className="mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={billingCycle === "M" ? "monthly" : "annual"}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="my-0 text-3xl font-semibold text-black"
              >
                <span>
                  RM
                  {billingCycle === "M" ? plan.monthlyPrice : plan.annualPrice}
                </span>
                <span className="text-sm font-medium">
                  /{billingCycle === "M" ? "month" : "year"}
                </span>
              </motion.p>
            </AnimatePresence>
            {plan.monthlyPrice !== 0 && (
              <motion.button
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  window.open(plan.link);
                }}
                className="mt-8 w-full rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-500/90"
              >
                Get Started
              </motion.button>
            )}
          </div>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              <Check className="text-red-500" size={18} />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-green-200 border-t-2 border-black py-12 text-black lg:px-2 lg:py-12"
    >
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
      <Heading />
      <PricingCards />
    </section>
  );
};

const BackgroundShift = ({ shiftKey }: { shiftKey: string }) => (
  <motion.span
    key={shiftKey}
    layoutId="bg-shift"
    className="absolute inset-0 -z-10 rounded-lg bg-red-500"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  />
);

export default function Pricing() {
  return <PricingSection />;
}
