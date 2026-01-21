# Design System - Progressia
> Dark gamified trading education platform with vibrant green accents

## Colors
**Primary:** `#9ACD32` | **Bright:** `#7FFF00` | **Purple:** `#8B5CF6` | **Blue:** `#3B82F6`
**BG:** `#0A1628` | **Surface:** `#1A2942` | **Surface Hover:** `#243550` | **Border:** `#2D3F5F`
**Text:** `#FFFFFF` / `#94A3B8` / `#64748B` | **Success:** `#22C55E` | **Error:** `#EF4444`

## Typography
**Fonts:** Inter (body) / Poppins (headings)
**Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');`
**Scale:** H1=`text-5xl font-bold` | H2=`text-4xl font-bold` | H3=`text-2xl font-semibold` | Body=`text-base` | Small=`text-sm` | Caption=`text-xs`

## Layout
**Spacing:** Tight=`gap-2 p-2` | Normal=`gap-4 p-4` | Relaxed=`gap-6 p-6` | Cards=`p-6`
**Radius:** Buttons=`rounded-xl` | Cards=`rounded-2xl` | Inputs=`rounded-lg` | Badges=`rounded-full`
**Shadows:** Default=`shadow-md` | Glow Green=`shadow-[0_0_20px_rgba(154,205,50,0.3)]`
**Transitions:** `transition-all duration-200` | Hover=`hover:scale-105`

## Key Components

**Primary Button:**
```jsx
<button className="bg-[#9ACD32] hover:bg-[#7FFF00] text-[#0A1628] font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(154,205,50,0.3)]">
```

**Card:**
```jsx
<div className="bg-[#1A2942] rounded-2xl p-6 border border-[#2D3F5F] hover:bg-[#243550] transition-all duration-200">
```

**Badge:**
```jsx
<span className="bg-[#9ACD32] text-[#0A1628] text-xs font-semibold px-3 py-1 rounded-full">⭐ +20 XP</span>
```

**Input:**
```jsx
<input className="w-full bg-[#1A2942] border border-[#2D3F5F] rounded-lg px-4 py-3 text-white placeholder:text-[#64748B] focus:border-[#9ACD32] focus:ring-2 focus:ring-[#9ACD32]/20" />
```

**Progress Bar:**
```jsx
<div className="w-full bg-[#1A2942] rounded-full h-3"><div className="bg-gradient-to-r from-[#9ACD32] to-[#7FFF00] h-full rounded-full transition-all duration-500" style={{width: '75%'}}></div></div>
```

## Icons & Misc
**Icons:** Lucide React (20-24px) | Primary: `text-[#9ACD32]` | Secondary: `text-[#94A3B8]`
**Common:** 🔥 (streak) | 🏆 (achievements) | ⭐ (XP) | ⚡ (actions) | 👑 (pro) | 💎 (tier)
**Grids:** Cards=`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` | Container=`max-w-7xl mx-auto px-4`
**Responsive:** sm=640px | md=768px | lg=1024px | xl=1280px

## Tailwind Config
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#9ACD32', 'primary-light': '#7FFF00',
        background: { primary: '#0A1628', secondary: '#0F1D33' },
        surface: { DEFAULT: '#1A2942', hover: '#243550' },
        border: '#2D3F5F',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(154, 205, 50, 0.3)',
      },
    },
  },
}
```

## Design Principles
1. **Gamification:** XP, badges, progress everywhere
2. **Dark-first:** No light mode needed
3. **Mobile-first:** Responsive from 640px+
4. **Accessibility:** Focus states (`focus:ring-2 focus:ring-[#9ACD32]`), semantic HTML, ARIA labels
