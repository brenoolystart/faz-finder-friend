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

- Store all storefront copy and image references in Lovable Cloud, with bundled assets used only as resilient fallbacks, so the password-protected admin remains the single editing surface.
- Store per-product gift form configuration as validated JSON in site_content; shared schemas keep admin and storefront field rendering consistent without changing catalog tables.
- Gift previews are illustrative masked placeholders, not generated bank numbers or exposed redemption codes; payment remains with the configured external checkout.
