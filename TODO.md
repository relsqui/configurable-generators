currently:
- adding a config editor
  - implement save and upload
  - fix reordering generators on rename
  - implement reordering generators on purpose
  - don't let generator names be empty (because they become unnavigable)
    - empty table names randomize but aren't clickable which ... that can be a secret feature I guess
next, functional changes:
- better error handling
- confirm before deleting config pieces
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- pins for individual random items
- undo button for individual random items
non-functional:
- switch to rename on a button press? mostly to make the UI more obvious
- automatically add tables when they're referenced in the editor?
  - then remove the handling of that case in buildTextTree
- tidy css (rearrange into more sensible groups)
- split up editor into smaller components
