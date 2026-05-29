import React from "react";
import { Eye, Save, X } from "lucide-react";

export default function CMSHeader() {
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E4278]">
            Content Management System
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola konten website utama Satgas PPKPT
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            <Eye size={18} /> Preview Website
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Eye size={18} /> Preview Website
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                  Live Preview
                </span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
              <div className="w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border border-gray-200">
                <iframe
                  src="/"
                  className="w-full h-full border-0"
                  title="Website Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
