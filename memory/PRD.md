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

## Implémenté (20/09/2026 — v3 assets officiels du client)
- 55 photos/affiches reçues du client (11 lots), triées pro : 14 photos salon + 4 presse en galerie HD (/public/assets/seim/), 4 photos studio Repère pour la WebTV, affiches officielles pour les actualités
- 18 intervenants RÉELS avec portraits recadrés des affiches officielles et fonctions corrigées : Sampy (pas Sampa), Makalou (pas Macalou), Houna (pas Douna), Cissé = Directeur Associé Groupe Repère, + nouveaux : Mouhamoud Coulibaly (BRVM Mali), Mohamed Konaté, Fayama, Abodji, Somda (SA2IF), Seini Amar (modérateur P3), Demba Koné (notaire), Arouna Sangaré (BOA), Dicko, Dede Coulibaly, + corrigés : Tidiane Kimbiry (Pispa Design), Oumou Abdoulaye (Zaga Zaga la Tisanière)
- Programme corrigé avec les horaires officiels de l'affiche (11 sessions dont Keynote 2 Finance Islamique, Masterclass 3 « 10 clés »)
- Partenaires réels : FACEJ (parrain), Ministère Entrepreneuriat, Royaume du Danemark, Pôle Excellence Conseils, INNOVA, Fantastique Prod, TM1, Malijet, MaliOnline, Hando Media, ORTM, Repère Médias
- Exposants remplacés par les vraies institutions présentes (FACEJ, BOA Mali, BRVM Mali, SA2IF, Club Investissement, etc.)
- Article presse réel : conférence de presse du 7 avril 2026
- Vidéos : fichiers vidéo promis par le client, pas encore reçus → vignettes WebTV réelles en attente de lecture
- À identifier si le client confirme : personnalités des photos 45/46/47 (keynote Finance Islamique ? masterclass 3 ?)

## Implémenté (20/09/2026 — v2 données réelles)
- Intégration complète du rapport officiel SEIM 2026 : 1ère édition 10-11 avril 2026 au CICB, thème « Éducation et inclusion financière : quels leviers à activer ? »
- Vrais intervenants : Hamidou Sampa (CREACOM, modérateur), Modibo Mao Macalou (IBS), Mohamed Douna, Cissé Issiaka Oumar (Cabinet ISSAFA), Cheick Oumar Sanou (Club Investissement) + 3 jeunes entrepreneurs FACEJ (Oumou Abdoulaye — Saga Saga, Sidiane Gimbiri — PISPA Design, Mariam Sissoko — La Cantine). Photos réelles extraites du PDF pour Cissé & Sanou, initiales pour les autres (portraits officiels à fournir).
- Vrai programme : 9 sessions (3 panels, 3 masterclasses, 1 keynote FACEJ, ouverture, clôture) avec textes du rapport.
- Vrais chiffres : 1 000+ visiteurs, 100 000+ touchés en ligne, 16 experts, 7 sessions, 50% jeunes, 30% femmes.
- Partenaires réels : FACEJ II (parrain officiel), Ministère de l'Entrepreneuriat National, Royaume du Danemark, PÉJ-Excellence Conseils, Cabinet ISSAFA, ADC International, ORTM, TM1, Hando Media, Media Online.
- Galerie : 12 vraies photos extraites du rapport (/public/assets/report/).
- Prochaine édition : 2ème édition, compte à rebours provisoire avril 2027 (config/event.js).
- Pages : Accueil, À propos, Programme (filtres), Intervenants (+modale), Exposants, Partenaires (+formulaire sponsoring), Inscription (3 pass + badge QR), Confirmation, Média (news/galerie/vidéos/presse), Éditions (rétrospective 2026), Contact, Mentions légales. FR/EN complet. Thème blanc + orange.
- Prix des pass Pro/VIP (25 000 / 75 000 FCFA) restent PROVISOIRES — à confirmer par le client.

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

## Charte graphique SEIM appliquée (logo + palette)
- Logo officiel: /frontend/public/assets/brand/seim-logo.png (+ seim-logo-white.png pour fonds sombres, seim-icon.png, favicon.ico)
- Palette: Bleu foncé #0C2D52, Jaune doré #F7B731, neutres #F2F4F6 / #B3C1CC / #334E68, secondaire #3AA57C
- Accent texte sur fond clair: #B57A0A (doré foncé, lisibilité)
