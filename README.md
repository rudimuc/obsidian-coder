# Encoder/Decoder Obsidian Plugin

This is a plugin for [Obsidian](https://obsidian.md) to encode / decode texts.

The first version supports only a text to base64 encoding.

The library used for the encoding is [base64-js](https://github.com/beatgammit/base64-js).


## Installation
### From within Obsidian
From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:
- Open Settings > Third-party plugin
- Make sure Safe mode is **off**
- Click Browse community plugins
- Search for "Encoder/Decoder Plugin"
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin

### From Github
- Clone this repository
- Follow the instructions of the official [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) to deploy it in your local installation

## Usage

Type the `transform-text-base64` keyword to use the Plugin.

````markdown
```transform-text-base64
this is a text to encode
```
````

The result will be this:

dGhpcyBpcyBhIHRleHQgdG8gZW5jb2Rl

## Version History
### 1.0.0
- First version to convert text to base64
