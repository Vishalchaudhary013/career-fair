import { Upload, Plus, X } from "lucide-react";
import { useState } from "react";

const BannerPhotosTab = ({
  bannerUrl, setBannerUrl,
  logoUrl, setLogoUrl,
}) => {

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerUrl({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl({ file, preview: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-10 w-full space-y-10">
      
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-primary">Fair Banner</h2>
          <p className="text-sm text-gray-500 mt-1">This is the main image shown on the Fair details page and cards.</p>
        </div>

        {bannerUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-sm group w-full max-w-4xl">
            <img src={bannerUrl.preview || bannerUrl} alt="Fair Banner" className="w-full aspect-[21/9] object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <label className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-100 transition">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
              </label>
              <button onClick={() => setBannerUrl("")} className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-secondary/90 transition">Remove</button>
            </div>
          </div>
        ) : (
          <label className="block w-full max-w-4xl aspect-[21/9] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition cursor-pointer flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Upload size={20} />
            </div>
            <span className="text-sm font-semibold text-gray-800">Click to upload banner</span>
            <span className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 600px</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
          </label>
        )}
      </div>

     
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-primary">Fair Logo</h2>
          <p className="text-sm text-gray-500 mt-1">Upload a square logo for your Fair or organization.</p>
        </div>

        {logoUrl ? (
          <div className="relative rounded-2xl overflow-hidden shadow-sm group w-48 h-48">
            <img src={logoUrl.preview || logoUrl} alt="Fair Logo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 flex-col">
              <label className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-100 transition">
                Change
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <button onClick={() => setLogoUrl("")} className="bg-secondary text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-secondary/90 transition">Remove</button>
            </div>
          </div>
        ) : (
          <label className="block w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition cursor-pointer flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Upload size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-800">Upload logo</span>
            <span className="text-[10px] text-gray-500 mt-1">Recommended: 400 x 400px</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        )}
      </div>
    </div>
  );
};

export default BannerPhotosTab;
