import { webFrame, ipcRenderer as ipc } from "electron";
jest.mock("fs");
import { dummyStore } from "@nteract/core/dummy";
import * as menu from "../../src/notebook/menu";
import { selectors, actions, actionTypes } from "@nteract/core";

describe("menu", () => {
  describe("dispatchCreateCellAfter", () => {
    test("dispatches a CREATE_CELL_AFTER with code action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchCreateCellAfter(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.createCellAfter({
          cellType: "code",
          source: "",
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchCreateTextCellAfter", () => {
    test("dispatches a CREATE_CELL_AFTER with markdown action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchCreateTextCellAfter(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.createCellAfter({
          cellType: "markdown",
          source: "",
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchPasteCell", () => {
    test("dispatches a pasteCell action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchPasteCell(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.pasteCell({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchCutCell", () => {
    test("dispatches a cutCell action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchCutCell(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.cutCell({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchCopyCell", () => {
    test("dispatches a copyCell action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchCopyCell(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.copyCell({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchSetTheme", () => {
    test("dispatches a SET_CONFIG_AT_KEY action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchSetTheme(store, {}, "test_theme");

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.SET_CONFIG_AT_KEY,
        key: "theme",
        value: "test_theme"
      });
    });
  });
  describe("dispatchSetCursorBlink", () => {
    test("dispatches a SET_CONFIG_AT_KEY action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchSetCursorBlink(store, {}, 42);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.SET_CONFIG_AT_KEY,
        key: "cursorBlinkRate",
        value: 42
      });
    });
  });

  describe("dispatchLoadConfig", () => {
    test("dispatches a LOAD_CONFIG action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchLoadConfig(store);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: "LOAD_CONFIG"
      });
    });
  });

  describe("dispatchZoomOut", () => {
    test("executes zoom out", () => {
      webFrame.setZoomLevel.mockReset();
      menu.dispatchZoomOut();
      expect(webFrame.setZoomLevel).toHaveBeenCalled();
    });
  });

  describe("dispatchZoomIn", () => {
    test("executes zoom in", () => {
      webFrame.setZoomLevel.mockReset();
      menu.dispatchZoomIn();
      expect(webFrame.setZoomLevel).toHaveBeenCalled();
    });
  });

  describe("dispatchZoomReset", () => {
    test("executes zoom reset", () => {
      webFrame.setZoomLevel.mockReset();
      menu.dispatchZoomReset();
      expect(webFrame.setZoomLevel).toHaveBeenCalledWith(0);
    });
  });

  describe("dispatchRestartClearAll", () => {
    test("dispatches RESTART_KERNEL with clearOutputs set to true", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchRestartClearAll(store);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.RESTART_KERNEL,
        payload: {
          clearOutputs: true,
          kernelRef: expect.any(String),
          contentRef: selectors.currentContentRef(store.getState())
        }
      });
    });
  });

  describe("dispatchRestartKernel", () => {
    test("dispatches restart kernel with clearOutputs set to false", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchRestartKernel(store);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.RESTART_KERNEL,
        payload: {
          clearOutputs: false,
          kernelRef: expect.any(String),
          contentRef: selectors.currentContentRef(store.getState())
        }
      });
    });
  });

  describe("dispatchInterruptKernel", () => {
    test("dispatches INTERRUPT_KERNEL actions", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchInterruptKernel(store);

      if (process.platform !== "win32") {
        expect(store.dispatch).toHaveBeenCalledWith({
          type: actionTypes.INTERRUPT_KERNEL,
          payload: {
            kernelRef: expect.any(String)
          }
        });
      }
    });
  });

  describe("dispatchKillKernel", () => {
    test("dispatches KILL_KERNEL actions", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchKillKernel(store);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.KILL_KERNEL,
        payload: {
          restarting: false,
          kernelRef: expect.any(String)
        }
      });
    });
  });

  describe("dispatchClearAll", () => {
    test("dispatches CLEAR_ALL_OUTPUTS actions", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchClearAll(store);

      expect(store.dispatch).toHaveBeenCalledWith(
        actions.clearAllOutputs({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchRunAllBelow", () => {
    test("runs all code cells below the focused cell", () => {
      const store = dummyStore({ codeCellCount: 4, markdownCellCount: 4 });
      const state = store.getState();
      store.dispatch = jest.fn();
      menu.dispatchRunAllBelow(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.executeAllCellsBelow({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchRunAll", () => {
    test("dispatches executeAllCells action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchRunAll(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.executeAllCells({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchUnhideAll", () => {
    test("", () => {
      const store = dummyStore({ hideAll: true });
      store.dispatch = jest.fn();
      menu.dispatchUnhideAll(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.unhideAll({
          outputHidden: false,
          inputHidden: false,
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchPublishAnonGist", () => {
    test("dispatches PUBLISH_ANONYMOUS_GIST action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchPublishAnonGist(store);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: "PUBLISH_ANONYMOUS_GIST"
      });
    });
  });

  describe("dispatchPublishUserGist", () => {
    test("sets github token if token provided", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchPublishUserGist(store, {}, "TOKEN");
      const expectedAction = { type: "SET_GITHUB_TOKEN", githubToken: "TOKEN" };
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
    test("dispatches setUserGithub and publishes gist", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchPublishUserGist(store, {});
      const expectedSecondAction = { type: "PUBLISH_USER_GIST" };
      expect(store.dispatch).toHaveBeenCalledWith(expectedSecondAction);
    });
  });

  describe("dispatchNewKernel", () => {
    test("dispatches LAUNCH_KERNEL action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchNewKernel(store, {}, { spec: "hokey" });

      expect(store.dispatch).toHaveBeenCalledWith({
        type: actionTypes.LAUNCH_KERNEL,
        payload: {
          kernelSpec: { spec: "hokey" },
          cwd: process.cwd(),
          selectNextKernel: true,
          kernelRef: expect.any(String),
          contentRef: selectors.currentContentRef(store.getState())
        }
      });
    });
  });

  describe("dispatchSave", () => {
    test("sends as SAVE request if given a filename", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchSave(store);
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.save({
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchSaveAs", () => {
    test("dispatches SAVE_AS action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();
      menu.dispatchSaveAs(store, {}, "test-ipynb.ipynb");
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.saveAs({
          filepath: "test-ipynb.ipynb",
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("dispatchLoad", () => {
    test("dispatches LOAD action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchLoad(store, {}, "test-ipynb.ipynb");
      expect(store.dispatch).toHaveBeenCalledWith({
        type: "CORE/FETCH_CONTENT",
        payload: {
          filepath: "test-ipynb.ipynb",
          params: {},
          kernelRef: expect.any(String),
          contentRef: selectors.currentContentRef(store.getState())
        }
      });
    });
  });

  describe("dispatchNewNotebook", () => {
    test("dispatches a NEW_NOTEBOOK action", () => {
      const store = dummyStore();
      store.dispatch = jest.fn();

      menu.dispatchNewNotebook(store, {}, { spec: "hokey" });
      expect(store.dispatch).toHaveBeenCalledWith({
        type: "NEW_NOTEBOOK",
        payload: {
          kernelSpec: { spec: "hokey" },
          cwd: process.cwd(),
          kernelRef: expect.any(String),
          contentRef: selectors.currentContentRef(store.getState())
        }
      });
    });
  });

  describe("initMenuHandlers", () => {
    test("registers the menu events", () => {
      const store = dummyStore();
      ipc.on = jest.fn();
      menu.initMenuHandlers(store);
      [
        "main:load-config",
        "menu:exportPDF",
        "menu:new-kernel",
        "menu:run-all",
        "menu:clear-all",
        "menu:unhide-all",
        "menu:save",
        "menu:save-as",
        "menu:new-code-cell",
        "menu:copy-cell",
        "menu:cut-cell",
        "menu:paste-cell",
        "menu:kill-kernel",
        "menu:interrupt-kernel",
        "menu:restart-kernel",
        "menu:restart-and-clear-all",
        "menu:publish:gist",
        "menu:github:auth",
        "menu:zoom-in",
        "menu:zoom-out",
        "menu:theme",
        "menu:set-blink-rate",
        "main:load",
        "main:new"
      ].forEach(name => {
        expect(ipc.on).toHaveBeenCalledWith(name, expect.any(Function));
      });
    });
  });

  describe("triggerWindowRefresh", () => {
    test("does nothing if no filename is given", () => {
      const store = dummyStore();

      expect(menu.triggerWindowRefresh(store, null)).toBeUndefined();
    });
    test("sends a SAVE_AS action if given filename", () => {
      const store = dummyStore();
      const filepath = "dummy-nb.ipynb";
      store.dispatch = jest.fn();

      menu.triggerWindowRefresh(store, filepath);

      expect(store.dispatch).toHaveBeenCalledWith(
        actions.saveAs({
          filepath,
          contentRef: selectors.currentContentRef(store.getState())
        })
      );
    });
  });

  describe("exportPDF", () => {
    test.skip("it notifies a user upon successful write", () => {
      const store = dummyStore();
      const notificationSystem = { addNotification: jest.fn() };
      const filepath = "thisisafilename.ipynb";
      menu.exportPDF(store, filepath, notificationSystem);
      expect(notificationSystem.addNotification).toHaveBeenCalledWith({
        title: "PDF exported",
        message: `Notebook ${filepath} has been exported as a pdf.`,
        dismissible: true,
        position: "tr",
        level: "success"
      });
    });
  });

  describe("storeToPDF", () => {
    test("triggers notification when not saved", () => {
      const config = { noFilename: true };
      const store = dummyStore(config);
      const notificationSystem = store.getState().app.get("notificationSystem");

      notificationSystem.addNotification = jest.fn();

      menu.storeToPDF(store);
      expect(notificationSystem.addNotification).toHaveBeenCalledWith({
        action: { callback: expect.any(Function), label: "Save As" },
        title: "File has not been saved!",
        message: [
          "Click the button below to save the notebook such that it can be ",
          "exported as a PDF."
        ],
        dismissible: true,
        position: "tr",
        level: "warning"
      });
    });
    test.skip("calls export PDF when filename exists", () => {
      const store = dummyStore();
      const addNotification = store.getState().app.get("notificationSystem")
        .addNotification;
      menu.storeToPDF(store);
      expect(addNotification).toHaveBeenCalledWith({
        title: "PDF exported",
        message: "Notebook dummy-store-nb has been exported as a pdf.",
        dismissible: true,
        position: "tr",
        level: "success"
      });
    });
  });
});
