<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep this homepage frontend-only; only the intro's watched/skipped preference may persist locally, with no services or guest data.
- Store confirmed hotel facts and the planned story collection in the browser-safe wedding-content module, so presentation and small factual tests share one source.
- Isolate the illustrated opening in site/intro with its own scoped styling and timeline; wrap the original homepage without editing its sections, so replay and film changes cannot alter the approved page. The intro is currently disabled and not mounted in src/routes/index.tsx.
- Scope device-specific hero overrides below 768px and from 1024px; leave the existing tablet utilities untouched to prevent cross-device regressions.
- Keep guest content on its dedicated TanStack routes; root owns the shared navigation and footer, and Our Journey reuses the existing story and photograph sections without changing their content.
- Use shared section-shell, section-divider and section-content CSS tokens for homepage spacing; exclude the hero and modal interiors so future content keeps a consistent rhythm without altering immersive experiences.
- Keep itinerary layout changes in WeddingItinerary and itinerary-scoped CSS, with shared spacing tokens and the unchanged agenda source, so other pages and event facts remain unaffected.
- FAQ deep links use existing category IDs as URL fragments; select and scroll the existing question panel without opening individual answers, so direct URLs and history share the same content.
- Reuse FaqCallout for travel-guide FAQ boxes so hotel and airport callouts share the same typography, padding and category-link behavior.
- Render travel section labels through SectionHeading using the existing driving eyebrow classes and gap, so labels stay consistent without changing heading alignment or typography.
