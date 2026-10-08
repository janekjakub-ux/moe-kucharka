# Moje Kuchařka

Česká kuchařka jako webová aplikace (PWA) — přes 300 receptů (česká, italská a světová kuchyně), hledání, filtry kategorií, přepočet ingrediencí podle počtu porcí a vlastní recepty ukládané v prohlížeči.

## Technologie

- React 19 + TanStack Start (Vite 7)
- Tailwind CSS v4
- TypeScript

## Spuštění lokálně

```bash
bun install   # nebo npm install
bun dev       # nebo npm run dev
```

Aplikace poběží na http://localhost:8080.

## Nahrání na GitHub

1. Na GitHubu vytvořte nový repozitář (bez README, ten tu už je).
2. V rozbalené složce projektu spusťte:

```bash
git init
git add .
git commit -m "Moje Kuchařka"
git branch -M main
git remote add origin https://github.com/VASE-JMENO/NAZEV-REPOZITARE.git
git push -u origin main
```

## Poznámky

- Recepty uživatele se ukládají do localStorage prohlížeče (klíč `pwa_kucharka_recipes`).
- Aplikaci lze nainstalovat na plochu telefonu (PWA manifest v `public/manifest.webmanifest`).
