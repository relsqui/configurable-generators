currently:
- adding a config editor
  - implement save and upload
  - implement reordering generators
  - confirm before deleting things
  - switch to rename on a button press, mostly to make the UI more obvious?
  - automatically add tables when they're referenced in the editor?
    - then remove the handling of that case in buildTextTree
next:
- error handling
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- clean up css
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- pins for individual random items
- undo button for individual random items
