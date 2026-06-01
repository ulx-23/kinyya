/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'modern-dark': '#0d0106',  /* Hitam beludru kemerahan ultra-mewah */
        'modern-card': '#1e0410',  /* Kaca pink gelap pekat */
        'pink-accent': '#EC4899',  /* Hot Pink kekinian */
        'pink-glow': '#F43F5E',    /* Rose Pink untuk pendaran cahaya */
        'pink-light': '#FBCFE8',   /* Pink permen lembut */
        'text-bright': '#FFF5F7',  /* Putih bersih hangat dengan semburat pink */
        'text-muted': '#F472B6',   /* Pink medium lembut */
        'gold-accent': '#FF758F',  /* Menggantikan aksen emas lama dengan Rose Gold-Pink cerah */
        'dark-bg': '#0d0106',      /* Background gelap seragam */
        'soft-white': '#FFF0F5',   /* Lavender blush / putih mawar sangat lembut */
        'navy-dark': '#2E0817',    /* Hitam pinkish pekat untuk teks surat */
        'soft-gray': '#FBCFE8',    /* Teks deskripsi redup */
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'handwritten': ['Dancing Script', 'cursive'],
      }
    },
  },
  plugins: [],
}