currently:
- adding a config editor
  - switch generator selector to a dropdown for consistency and so empty titles are reachable
    - maybe also explicit "rename" button instead of live changing (this would also support table name updating)
next, MVP:
- error handling
- confirm before deleting config pieces or resetting config
non-MVP but functional:
- implement uploading into the editor
- fix reordering generators on rename
- implement reordering generators on purpose
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- pins for individual random items
- undo button for individual random items
- implement preview from editor
non-functional:
- set flex bases for the editor textareas so they don't collapse too much
- switch to rename on a button press? mostly to make the UI more obvious
- automatically add tables when they're referenced in the editor?
  - then remove the handling of that case in buildTextTree
- tidy css (rearrange into more sensible groups)
- split up editor into smaller components
