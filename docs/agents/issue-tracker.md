# Issue tracker: GitHub

Issues and specs live in GitHub Issues. Use `gh` from
`Axi_3d_Website/`, where the repository remote is configured.

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open`
- Comment: `gh issue comment <number> --body "..."`
- Label: `gh issue edit <number> --add-label "..."`
- Close: `gh issue close <number> --comment "..."`

## Pull requests as a triage surface

**PRs as a request surface: no.**

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", run
`gh issue view <number> --comments`.
