import { CreditCard } from 'lucide-react';

export default function Payment() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="bg-gradient-to-br from-[#C9A58A] to-[#8B7355] p-8 rounded-3xl mb-6">
        <CreditCard className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Management</h2>
      <p className="text-gray-600 text-center max-w-md">
        Manage payment methods, transactions, and financial reports here. This feature is coming soon!
      </p>
    </div>
  );
}
