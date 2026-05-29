import React from "react";
import { Save } from "lucide-react";

export default function FloatingSaveButton() {
  return (
    <div className="fixed bottom-6 right-6 md:hidden">
      <button className="flex items-center justify-center w-14 h-14 bg-[#1E4278] text-white rounded-full shadow-lg hover:bg-blue-800 transition-colors">
        <Save size={24} />
      </button>
    </div>
  );
}
