- fix filling local storage with editor tempfiles
- error handling
- confirm before deleting config pieces or resetting config
- implement uploading into the editor
- fix reordering generators on rename
- implement reordering generators on purpose
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- add content version field to the editor
  - first figure out why it doesn't seem to be working in the upload??
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- pins for individual random items
- undo button for individual random items
- maybe have renaming a table live update it in the config?
  - this means switching to a button press so that substring table names don't have unintended effects
- automatically add tables when they're referenced in the editor?
- tidy css (rearrange into more sensible groups)
  - make an IconButton component to centralize a bunch of logic
- split up editor into smaller components
- set up PWA machinery so it's even easier to use offline
