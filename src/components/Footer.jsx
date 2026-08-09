import React from 'react';

export default function Footer() {
  const socialLinks = {
    instagram: "https://instagram.com/ecomappleco.id?igsh=N290eXRvamsyZTRx",
    tiktok: "https://tiktok.com/@ecomap.pleco?_r=1&_t=ZS-97pfGqwq00L",
    whatsapp: "https://wa.me/6283806325962" 
  };

  return (
    /* DITAMBAHKAN: shrink-0 agar Footer tidak tertekan memendek oleh elemen main */
    <footer className="w-full shrink-0 bg-[#FDF1CE] py-8 px-4 flex flex-col items-center justify-center border-t border-[#008000]/10 font-sans select-none">
      <div className="max-w-2xl w-full text-center space-y-5">
        
        {/* BARIS 1: IKON MEDIA SOSIAL */}
        <div className="flex items-center justify-center gap-5">
          
          {/* Instagram */}
          <a 
            href={socialLinks.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#008000] text-[#FDF1CE] flex items-center justify-center hover:bg-[#006400] hover:scale-105 active:scale-95 transition-all shadow-sm p-2.5 sm:p-3 shrink-0"
            aria-label="Instagram EcoMap Pleco"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a 
            href={socialLinks.tiktok} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#008000] text-[#FDF1CE] flex items-center justify-center hover:bg-[#006400] hover:scale-105 active:scale-95 transition-all shadow-sm p-2.5 sm:p-3 shrink-0"
            aria-label="TikTok EcoMap Pleco"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.63 4.15 1.13 1.21 2.67 1.94 4.31 2.07v3.94c-1.7-.12-3.32-.73-4.65-1.79-.11-.08-.2-.17-.32-.27V14.5c.03 2.76-.92 5.48-2.69 7.55-2.07 2.4-5.23 3.51-8.32 2.92-3.15-.56-5.89-2.73-7.05-5.74C-1.63 15.93-.32 12.06 2.6 10.02c2.14-1.5 4.88-1.87 7.33-1.02V13c-1.39-.47-2.95-.24-4.14.61-1.25.88-1.89 2.49-1.6 4.02.3 1.58 1.6 2.85 3.19 3.1 1.59.27 3.23-.42 3.97-1.86.35-.68.49-1.45.47-2.22V.02h.7z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a 
            href={socialLinks.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#008000] text-[#FDF1CE] flex items-center justify-center hover:bg-[#006400] hover:scale-105 active:scale-95 transition-all shadow-sm p-2.5 sm:p-3 shrink-0"
            aria-label="WhatsApp EcoMap Pleco"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6 9.5 3.497 1.45 5.416 1.451 5.428 0 9.842-4.414 9.845-9.843.002-2.63-1.023-5.101-2.886-6.964a9.757 9.757 0 0 0-6.965-2.879C6.574 1.92 2.162 6.334 2.16 11.765c-.001 1.928.504 3.814 1.462 5.422l-.993 3.628 3.715-.975zM17.52 14.3c-.3-.149-1.777-.877-2.051-.976-.274-.1-.474-.149-.674.15-.2.299-.774.976-.949 1.174-.175.199-.349.224-.649.075-.3-.149-1.266-.467-2.41-1.487-.89-.793-1.49-1.773-1.665-2.072-.175-.3-.019-.462.13-.611.135-.134.3-.349.449-.523.149-.174.199-.299.299-.498.1-.2.05-.374-.025-.523-.075-.15-.674-1.623-.924-2.224-.244-.585-.493-.506-.674-.515-.175-.008-.375-.01-.575-.01s-.524.075-.798.374c-.275.299-1.049 1.024-1.049 2.5 0 1.472 1.073 2.891 1.223 3.09.15.2 2.11 3.222 5.114 4.521.715.309 1.273.493 1.708.632.719.228 1.373.196 1.891.118.577-.087 1.777-.726 2.026-1.424.249-.699.249-1.296.174-1.424-.075-.124-.274-.199-.574-.349z"/>
            </svg>
          </a>

        </div>

        {/* BARIS 2: COPYRIGHT */}
        <div className="text-xs md:text-sm font-semibold text-[#008000]/90">
          © 2026 EcoMap-Pleco. All rights reserved.
        </div>

        {/* BARIS 3: LINKS (DISESUAIKAN: Menyembunyikan separator '|' jika baris tertekuk) */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[11px] md:text-xs text-[#008000]/80 font-medium max-w-lg mx-auto">
          <a href="#privacy" className="hover:underline hover:text-[#006400] transition-colors">Privacy Policy</a>
          <span className="opacity-40 select-none">•</span>
          <a href="#cookies" className="hover:underline hover:text-[#006400] transition-colors">Cookie Consent Tool</a>
          <span className="opacity-40 select-none">•</span>
          <a href="#terms" className="hover:underline hover:text-[#006400] transition-colors">Terms of Use</a>
          <span className="opacity-40 select-none">•</span>
          <a href="#sitemap" className="hover:underline hover:text-[#006400] transition-colors">Site Map</a>
          <span className="opacity-40 select-none">•</span>
          <a href="#about" className="hover:underline hover:text-[#006400] transition-colors">About Pleco Project</a>
        </div>

      </div>
    </footer>
  );
}