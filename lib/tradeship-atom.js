"use babel";

import { CompositeDisposable } from "atom";
import * as path from "path";
import { spawnSync } from "child_process";

import config from "./config-schema.json";

export default {
  config,
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "tradeship-atom:import": () => {
          const editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return;
          }
          this.import(editor);
        },

        "tradeship-atom:settings": () => {
          atom.workspace.open("atom://config/packages/tradeship-atom");
        }
      })
    );

    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        editor.getBuffer().onWillSave(() => {
          const importOnSave = atom.config.get("tradeship-atom.importOnSave");
          const scope = editor.getGrammar().scopeName;

          if (importOnSave.enabled && importOnSave.scopes.includes(scope)) {
            this.import(editor);
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  import(editor) {
    const position = editor.getCursorScreenPosition();
    const dir = this.getDir(editor);
    const code = editor.getText();

    if (!dir) {
      const message = "tradeship: file must be saved to a path or be in a " +
        "workspace";
      atom.notifications.addError(message);
      return;
    }

    const cmd = spawnSync("tradeship", ["-s", dir], {
      input: code,
      encoding: "utf8"
    });
    if (cmd.status !== 0) {
      atom.notifications.addError("tradeship: couldn't import dependencies", {
        detail: cmd.stderr
      });
      return;
    }

    editor.setText(cmd.stdout);
    editor.setCursorScreenPosition(position);
  },

  getDir(editor) {
    const filePath = editor.getPath();
    if (filePath) {
      return path.dirname(filePath);
    }

    const dirs = atom.project.getDirectories();
    if (dirs.length > 0) {
      return dirs[0].getRealPathSync();
    }
    return null;
  }
};
