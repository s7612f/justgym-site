# JustGym Website

**Live site:** https://s7612f.github.io/justgym-site/

Premium gym website — static HTML/CSS/JS. No build step required.

## Pages

| File | Route |
|------|-------|
| `index.html` | Home |
| `classes.html` | Class schedule (tabbed by day) |
| `membership.html` | Pricing plans + comparison table + FAQ |
| `booking.html` | 4-step class booking flow |
| `signup.html` | Sign up / Log in |
| `about.html` | Story, values, trainer profiles |
| `contact.html` | Contact form + gym info |

## Features

- **Booking flow** — 4-step wizard: pick date (interactive calendar) → choose class → enter details → confirm. Booking stored in `localStorage`.
- **Sign up / Log in** — form validation, password match check, plan selection, stored in `localStorage`.
- **Day-tabbed schedule** — full weekly class timetable across 7 days.
- **Membership comparison** — 3 plans (Starter £29 / Elite £49 / Pro £79) with feature table and FAQ.
- **Responsive** — mobile nav toggle, all grids collapse to single column.
- **Design** — dark premium aesthetic, black + gold (`#c9a84c`), Bebas Neue headings, Inter body.

## Running locally

Open `index.html` in any browser, or serve with:

```bash
npx serve .
# or
python -m http.server 8080
```

## Hosting (GitHub Pages)

1. Push to a GitHub repo
2. Go to **Settings → Pages → Source: main branch / root**
3. Site available at `https://<username>.github.io/<repo>/`

## Notes

- All forms are demo-only (client-side). Data goes to `localStorage`, not a server.
- Unsplash images used for hero backgrounds — replace with real gym photos.
- To wire up real bookings, add a Cloudflare Worker + D1/KV backend.
