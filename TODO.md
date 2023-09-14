MVP:
- error handling
- confirm before deleting config pieces or resetting config
- catch up on accessibility
non-MVP functional changes:
- implement uploading into the editor
- fix reordering generators on rename
- implement reordering generators on purpose
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- pins for individual random items
- undo button for individual random items
- maybe have renaming a table live update it in the config?
  - this means switching to a button press so that substring table names don't have unintended effects
- automatically add tables when they're referenced in the editor?
non-functional improvements:
- tidy css (rearrange into more sensible groups)
  - make an IconButton component to centralize a bunch of logic
- split up editor into smaller components
