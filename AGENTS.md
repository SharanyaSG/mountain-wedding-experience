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
- Keep all guest-facing sections on the homepage in the approved scroll order; shared root navigation uses typed same-page hash links, and legacy standalone URLs redirect to their section anchors.
