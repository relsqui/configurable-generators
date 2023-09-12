currently:
- adding a config editor
  - delete generator
  - add table editing
    - and deletion
  - implement save and upload
  - automatically add tables when they're referenced in the editor
    - then remove the handling of that case in buildTextTree
  - confirm before deleting
next:
- error handling
- prevent re-randomizing to the same item
- customize colors (in the config maybe?)
- clean up css
- timestamp cached configs and expire them with inactivity -- and/or replace w/same title?
- pins for individual random items
- undo button for individual random items
