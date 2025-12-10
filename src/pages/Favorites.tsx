import { Heart } from 'lucide-react';

export default function Favorites() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="bg-gradient-to-br from-[#C9A58A] to-[#8B7355] p-8 rounded-3xl mb-6">
        <Heart className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Favorites</h2>
      <p className="text-gray-600 text-center max-w-md">
        Mark your favorite products and orders here. This feature is coming soon!
      </p>
    </div>
  );
}
