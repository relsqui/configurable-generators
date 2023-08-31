# Configurable Generators

This is a static site that creates random text from a set of generator templates and content tables. It doesn't save or host any generators, it only reads configuration files provided by the user. That means game makers can distribute their own config files however they want (as a supplement to paper-and-dice data tables) and also that the app works completely offline.

## Config files

The generator config files are plain JSON. This example includes all the required elements:

```json
{
  "title": "Config Template",
  "schemaVersion": "0.1.0",
  "generators": {
    "Example": [
      "Random color: <color>",
      "Another (or possibly the same) random color: <color>"
    ],
    "Example 2": [
      "An animal: <animal>"
    ]
  },
  "tables": {
    "color": [
      "red",
      "green",
      "blue"
    ],
    "animal": [
      "duck",
      "ibex",
      "orangutan"
    ]
  }
}
```

## Building the app

See [Create React App](https://github.com/facebook/create-react-app)'s docs. TL;DR:

* `npm start` to run a dev instance locally.
* `npm run build` to package the app for deployment.
