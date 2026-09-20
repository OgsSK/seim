# PRD — SEIM : Salon de l'Épargne et de l'Investissement du Mali

## Problème initial (résumé)
Créer une plateforme web événementielle premium (inspiration : semainedelepargne.com + salondelepargne.com, sans copie) pour le SEIM : hero avec dates/lieu/compte à rebours, présentation, programme 2 jours avec filtres, intervenants, formats (CEO Talks, Young CEO Talks, Apéro Cash, WebTV, Expo…), exposants, sponsors/partenaires, inscription avec badge, espace média (actualités/galerie/vidéos/presse), éditions précédentes, contact, footer institutionnel, responsive, FR/EN.

## Identité confirmée par le client
- Nom : Salon de l'Épargne et de l'Investissement du Mali (SEIM)
- Logo : wordmark bleu marine + flèche zigzag ambre (fichiers dans /app/frontend/public/assets/)
- Couleurs : navy #0B132B + or/ambre #F59E0B
- Contact : +223 71 39 53 88 (tél. + WhatsApp), Bacodjicoroni Golf, Immeuble BAMA, Bamako
- Facebook : https://www.facebook.com/people/Salon-de-lEpargne-et-de-lInvestissement-du-Mali/61577154304057
- Handle : @SEIM2026

## Choix client (réponses ask_human)
- Date future modifiable à chaque édition → centralisée dans `/app/frontend/src/config/event.js` (actuellement 24–25 novembre 2026, CICB Bamako)
- V1 complète multi-pages
- Formulaire d'inscription simple (sans email automatique)
- Bilingue FR/EN fonctionnel (bouton header)
- Données d'exemple en attendant les vraies données

## Architecture
- Frontend : React 19 + react-router 7, Tailwind, framer-motion (révélations au scroll), lenis (smooth scroll), qrcode.react (badge), sonner (toasts). i18n maison : `/app/frontend/src/i18n/translations.js` (FR/EN complets).
- Backend : FastAPI + MongoDB (motor). Seed idempotent au démarrage (`/app/backend/seed_data.py`) : 10 intervenants, 18 sessions, 12 exposants, 12 partenaires, 4 articles, 3 éditions, galerie.
- API : GET /api/speakers, /api/program, /api/exhibitors, /api/partners, /api/articles, /api/editions, /api/gallery ; POST /api/registrations (code SEIM26-XXXXXX, dédoublonnage par email), GET /api/registrations/{code} ; POST /api/contacts.

## Implémenté (20/09/2026)
- Pages : Accueil (hero cinétique + parallax + compte à rebours + marquee), À propos, Programme (onglets jour 1/2 + filtres par format + accordéons avec intervenants), Intervenants (grille + modale profil), Exposants (filtres par secteur + CTA), Partenaires (6 niveaux + formulaire dossier sponsoring), Inscription (3 pass + formulaire complet), Confirmation (badge numérique + QR code + impression), Média (actualités / galerie / vidéos / presse), Éditions (timeline 2023-2025), Contact (formulaire typé + WhatsApp + carte Google), Mentions légales / Confidentialité.
- Header fixe glass + switch FR/EN + CTA S'inscrire ; menu mobile hamburger.
- Footer complet avec sitemap, coordonnées et réseaux.

## Vérifié
- curl : tous les endpoints OK (10 speakers, 18 sessions, inscription code SEIM26-A275E1, contact).
- Screenshots : hero, programme (filtre + expansion), inscription → confirmation avec QR (SEIM26-3CDCF1), mobile menu, modale intervenant, switch EN.

## Backlog priorisé
- P0 : Remplacer les données d'exemple par les vraies (intervenants, exposants, partenaires, articles, photos officielles)
- P0 : Email de confirmation d'inscription (Resend géré par la plateforme)
- P1 : Back-office admin (CMS) pour gérer contenus, inscriptions et dates sans toucher au code
- P1 : Vraies vidéos WebTV (embeds YouTube) + dossier de presse téléchargeable
- P1 : Paiement des Pass Pro/VIP (Stripe ou paiement mobile local)
- P2 : Pages articles individuelles, galerie lightbox, traduction EN des contenus éditoriaux longs
- P2 : Export CSV des inscrits, scan du QR à l'entrée
