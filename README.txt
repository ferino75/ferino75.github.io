projects.json is now the single source of truth.

To add a project, add only one new object under "projects" in projects.json.
Required manual fields:
name, category, logo, preview, compatibility, php, description, tags, jed, featured

The workflow automatically fills/updates:
html_url, stargazers_count, updated_at, pushed_at, language,
release_tag, release_html_url, release_zip_url, download_count

Because projects.json is included in the workflow push paths, committing a new
project automatically triggers Update project data.

The page automatically updates:
- cards
- category filters
- compatibility rows
- compatibility columns
- ordering by pushed_at
