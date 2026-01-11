
import React from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { SubscriptionTier } from '../types';

interface SubscriptionPlanProps {
  onPlanSelected: (tier: SubscriptionTier) => void;
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ onPlanSelected }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Choose Your Power Tier</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Scale your technology business across Aceh and Sumatra with our specialized subscription plans.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.tier} 
            className={`glass-panel p-8 rounded-3xl flex flex-col border-2 ${plan.tier === SubscriptionTier.PRO ? 'border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20' : 'border-slate-800'}`}
          >
            {plan.tier === SubscriptionTier.PRO && (
              <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full self-start mb-4">Recommended</span>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">Rp {plan.priceMonthly.toLocaleString()}</span>
              <span className="text-slate-500 ml-2">/month</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onPlanSelected(plan.tier)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${plan.tier === SubscriptionTier.PRO ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'}`}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
