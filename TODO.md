currently:
- refactoring so adding more things doesn't suck
  - add a top nav to Root route with:
    - preset selector
    - upload button
    - create button (goes to editor-with-no-slug)
    - download button (if local route)
    - preview/edit toggle (if local route, goes to editor-with-slug)
  - get description back in footer, maybe with https://reactrouter.com/en/main/hooks/use-matches ? (or the outlet context)
  - clean up css
next:
- add a config editor
  - use Local's loader to get a local config from a slug
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- prevent re-randomizing to the same item
- pins for individual random items
- undo button for individual random items
