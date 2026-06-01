import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const titleText = "Surat Cinta";
const descText = "Sebuah surat kecil penuh perasaan yang ditulis dari lubuk hati terdalam khusus untukmu.";
const romanticMsg = "Terima kasih telah hadir dan memberikan warna terindah dalam setiap langkah hidupku. Kamu adalah jawaban atas setiap doa dan harapan terbaikku. Teruntuk kinyya, dengan segenap rasa cinta di hatiku.";

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#1a0510]/80 backdrop-blur-xl border border-[#FF2E93]/20 rounded-3xl max-w-sm shadow-[0_20px_50px_rgba(255,46,147,0.15)] text-white">
      <div className="mb-2 text-[#FF2E93]">
        <Heart size={28} fill="currentColor" className="animate-pulse" />
      </div>
      <h2 className="font-serif text-xl font-bold text-[#FBCFE8] mb-2">{titleText}</h2>
      <p className="font-sans text-xs text-[#FF758F]/80 leading-relaxed font-light text-center mb-4">{descText}</p>
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="px-5 py-2.5 bg-[#FF2E93] hover:bg-[#FF2E93]/80 rounded-full font-medium text-xs shadow-[0_8px_20px_rgba(255,46,147,0.3)] transition-all cursor-pointer"
      >
        {isOpen ? "Tutup Surat" : "Buka Surat"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-[#FF2E93]/20 pt-4 overflow-hidden"
          >
            <p className="font-serif italic text-xs leading-relaxed text-[#FF8DA1] text-center">
              "{romanticMsg}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
