import React from 'react';
import { Check, Crown, Coins } from 'lucide-react';
import { User, SubscriptionTier } from '../types';

interface SubscriptionsProps {
  user: User;
}

const Subscriptions: React.FC<SubscriptionsProps> = ({ user }) => {
  const plans = [
    {
      name: 'Basic',
      price: '₹499',
      features: ['Access to Study Planner', 'Basic Quiz Generation', 'Limited Past Papers'],
      tier: SubscriptionTier.Basic,
      color: 'gray'
    },
    {
      name: 'Standard',
      price: '₹799',
      features: ['Everything in Basic', 'Unlimited Explanations', 'Focus Timer Pro', 'Priority Support'],
      tier: SubscriptionTier.Standard,
      color: 'blue'
    },
    {
      name: 'Premium',
      price: '₹1,999',
      features: ['Everything in Standard', 'AI Mindmaps', 'Video Summaries', '1-on-1 Mentorship'],
      tier: SubscriptionTier.Premium,
      color: 'purple'
    }
  ];

  const discount = Math.floor(user.coins / 10) * 50;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Upgrade Your Learning</h2>
        <p className="text-gray-400">Choose the plan that fits your ambition.</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-600/30 p-4 rounded-xl flex items-center justify-between">
         <div className="flex items-center">
            <Coins className="text-yellow-500 mr-3" size={24} />
            <div>
                <p className="text-white font-bold">You have {user.coins} Coins</p>
                <p className="text-xs text-yellow-400">Redeem for ₹{discount} discount on any plan!</p>
            </div>
         </div>
         <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-lg transition-colors">
            Apply Discount
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {plans.map((plan) => {
            const isCurrent = user.subscription === plan.tier;
            const isPremium = plan.tier === SubscriptionTier.Premium;
            
            return (
                <div key={plan.name} className={`relative bg-secondary rounded-2xl p-6 border ${isCurrent ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-700'} ${isPremium ? 'overflow-hidden' : ''}`}>
                    {isPremium && (
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            BEST VALUE
                        </div>
                    )}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                            <span className="text-gray-500 text-sm ml-1">/year</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {plan.features.map(f => (
                            <li key={f} className="flex items-center text-gray-300 text-sm">
                                <Check size={16} className={`mr-2 ${isPremium ? 'text-purple-400' : 'text-primary'}`} />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <button 
                        className={`w-full py-3 rounded-xl font-bold transition-all ${
                            isCurrent 
                            ? 'bg-gray-700 text-gray-400 cursor-default' 
                            : isPremium 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg' 
                                : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                        }`}
                    >
                        {isCurrent ? 'Current Plan' : 'Choose Plan'}
                    </button>
                </div>
            );
         })}
      </div>
    </div>
  );
};

export default Subscriptions;
