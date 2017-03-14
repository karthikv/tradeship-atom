# Tradeship for Atom
Atom package to run [tradeship](https://github.com/karthikv/tradeship), which
automatically imports JS dependencies and removes unused ones.

## Installation
Ensure you have tradeship installed:

```sh
$ npm install -g tradeship
# or use yarn:
$ yarn global add tradeship
```

In atom, settings/preferences > install > search "tradeship". Or:

```sh
$ apm install tradeship
```

## Usage
To run tradeship, you may either:

- Press <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>i</kbd>
- Right click > Import Dependencies
- Packages > tradeship > Import Dependencies
- To run on save, go to settings (Packages > tradeship > Settings) and enable
  import on save.

The first time tradeship runs in a project directory with many JavaScript files,
it'll take some time to parse and cache dependencies. Future runs will be much
faster.

## License
[MIT](LICENSE.md)
