// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/game.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var generateEmptyState = function generateEmptyState(rows, cols) {
  return new Array(rows).fill(0).map(function () {
    return new Array(cols).fill('empty');
  });
};

exports.getSequences = function (array) {
  var result = [];

  for (var i = 0; i < array.length; i++) {
    if (array[i] === 1) {
      if (i === 0) {
        result.push(1);
      } else {
        if (array[i - 1] === 1) {
          result[result.length - 1] = result[result.length - 1] + 1;
        } else {
          result.push(1);
        }
      }
    }
  }

  return result.length === 0 ? [0] : result;
};

exports.getAllHorizontalSequences = function (field) {
  var sequences = [];

  for (var i = 0; i < field.length; i++) {
    sequences.push(exports.getSequences(field[i]));
  }

  return sequences;
};

exports.getAllVerticalSequences = function (field) {
  var sequences = [];

  var _loop_1 = function _loop_1(j) {
    var column = field.map(function (row) {
      return row[j];
    });
    sequences.push(exports.getSequences(column));
  };

  for (var j = 0; j < field[0].length; j++) {
    _loop_1(j);
  }

  return sequences;
};

var Game =
/** @class */
function () {
  function Game(data, view) {
    this.mode = 'coloring';
    this.lifeCounter = 3;
    this.data = data;
    this.level = 0;
    this.setLevel(0, data);
    this.view = view;
  }

  Game.prototype.setLevel = function (level, data) {
    var picture = data[level].picture;
    var field = data[level].field;
    this.field = field;
    this.picture = picture;
    this.state = generateEmptyState(field.length, field[0].length);
    this.verticalSequences = exports.getAllVerticalSequences(field);
    this.horizontalSequences = exports.getAllHorizontalSequences(field);
  };

  Game.prototype.render = function () {
    this.view.render({
      state: this.state,
      lifeCounter: this.lifeCounter,
      horizontalSequences: this.horizontalSequences,
      verticalSequences: this.verticalSequences
    });
  };

  Game.prototype.renderPicture = function () {
    this.view.renderPicture({
      picture: this.picture,
      state: this.state,
      lifeCounter: this.lifeCounter,
      horizontalSequences: this.horizontalSequences,
      verticalSequences: this.verticalSequences
    });
  };

  Game.prototype.handleNewGameButtonClick = function () {
    this.lifeCounter = 3;
    this.state = generateEmptyState(this.field.length, this.field[0].length);
    this.view.renderEndGame(false);
    this.init();
  };

  Game.prototype.handleNextLevelButtonClick = function () {
    if (this.level + 1 < this.data.length) {
      this.level++;
      this.setLevel(this.level, this.data);
      this.view.renderVictoryView(false);
      this.render();
    }
  };

  Game.prototype.checkWin = function () {
    for (var i = 0; i < this.field.length; i++) {
      for (var j = 0; j < this.field[0].length; j++) {
        if (this.field[i][j] === 1 && this.state[i][j] !== 'colored') {
          return false;
        }
      }
    }

    return true;
  };

  Game.prototype.handleCellClick = function (i, j) {
    if (this.state[i][j] !== 'empty' || this.lifeCounter === 0) {
      return;
    }

    if (this.mode === 'coloring') {
      if (this.field[i][j] === 1) {
        this.state[i][j] = 'colored';
      } else {
        this.state[i][j] = 'crossed';
        this.lifeCounter -= 1;
      }
    }

    if (this.mode === 'crossing') {
      if (this.field[i][j] !== 1) {
        this.state[i][j] = 'crossed';
      } else {
        this.state[i][j] = 'colored';
        this.lifeCounter -= 1;
      }
    }

    if (this.lifeCounter === 0) {
      this.view.renderEndGame(true);
    }

    if (this.checkWin()) {
      this.view.renderVictoryView(true, this.picture);
      this.renderPicture();
    } else {
      this.render();
    }
  };

  Game.prototype.handleModeChange = function (mode) {
    this.mode = mode;
  };

  Game.prototype.init = function () {
    var _this = this;

    this.view.initHandlers({
      handleCellClick: function handleCellClick(i, j) {
        return _this.handleCellClick(i, j);
      },
      handleModeChange: function handleModeChange(mode) {
        return _this.handleModeChange(mode);
      },
      handleNewGameButtonClick: function handleNewGameButtonClick() {
        return _this.handleNewGameButtonClick();
      },
      handleNextLevelButtonClick: function handleNextLevelButtonClick() {
        return _this.handleNextLevelButtonClick();
      }
    });
    this.render();
  };

  return Game;
}();

exports.Game = Game;
},{}],"src/view.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var View =
/** @class */
function () {
  function View(element, buttonElement, lifeCounterElement, endGameElement, victoryElement) {
    this.element = null;
    this.buttonElement = null;
    this.lifeCounterElement = null;
    this.endGameElement = null;
    this.victoryElement = null;
    this.element = element;
    this.buttonElement = buttonElement;
    this.lifeCounterElement = lifeCounterElement;
    this.endGameElement = endGameElement;
    this.victoryElement = victoryElement;
  }

  View.prototype.getAllVerticalSequencesElement = function (verticalSequences, state) {
    var fragment = document.createDocumentFragment();

    var _loop_1 = function _loop_1(i) {
      var element = document.createElement('div');
      element.classList.add('vertical-seqs');
      var sequencesSum = verticalSequences[i].reduce(function (sum, current) {
        return sum + current;
      }, 0);
      var coloredCellCount = state.reduce(function (sum, row) {
        return row[i] === 'colored' ? sum + 1 : sum;
      }, 0);

      if (sequencesSum === coloredCellCount) {
        element.classList.add('vertical-seqs_done');
      }

      for (var j = 0; j < verticalSequences[i].length; j++) {
        var item = document.createElement('span');
        item.classList.add('vertical-seqs__item');
        item.textContent = String(verticalSequences[i][j]);
        element.appendChild(item);
      }

      fragment.appendChild(element);
    };

    for (var i = 0; i < verticalSequences.length; i++) {
      _loop_1(i);
    }

    return fragment;
  };

  View.prototype.getHorizontalSequencesElement = function (i, horizontalSequences, state) {
    var element = document.createElement('div');
    element.classList.add('horizontal-seqs');
    var sequencesSum = horizontalSequences[i].reduce(function (sum, current) {
      return sum + current;
    }, 0);
    var coloredCellCount = state[i].reduce(function (sum, current) {
      return current === 'colored' ? sum + 1 : sum;
    }, 0);

    if (sequencesSum === coloredCellCount) {
      element.classList.add('horizontal-seqs_done');
    }

    for (var j = 0; j < horizontalSequences[i].length; j++) {
      var item = document.createElement('span');
      item.classList.add('horizontal-seqs__item');
      item.textContent = String(horizontalSequences[i][j]);
      element.appendChild(item);
    }

    return element;
  };

  View.prototype.getCornerCell = function () {
    var cornerCell = document.createElement('div');
    cornerCell.classList.add('corner-cell');
    return cornerCell;
  };

  View.prototype.renderEndGame = function (isEndGameShown) {
    if (this.endGameElement) {
      if (isEndGameShown) {
        this.endGameElement.classList.remove('end-game_hidden');
      } else {
        this.endGameElement.classList.add('end-game_hidden');
      }
    }
  };

  View.prototype.renderVictoryView = function (isVictoryViewShown, picture) {
    if (this.victoryElement) {
      if (isVictoryViewShown && picture) {
        this.victoryElement.classList.remove('victory_hidden');
        var pictureElement = this.victoryElement.querySelector('#victory-picture');

        if (pictureElement) {
          pictureElement.innerHTML = '';
          pictureElement.appendChild(this.getPictureElement({
            picture: picture
          }));
        }
      } else {
        this.victoryElement.classList.add('victory_hidden');
      }
    }
  };

  View.prototype.getPictureElement = function (_a) {
    var picture = _a.picture,
        sequencesParams = _a.sequencesParams;
    var fragment = document.createDocumentFragment();

    if (sequencesParams) {
      fragment.appendChild(this.getCornerCell());
      fragment.appendChild(this.getAllVerticalSequencesElement(sequencesParams.verticalSequences, sequencesParams.state));
    }

    for (var i = 0; i < picture.length; i++) {
      if (sequencesParams) {
        fragment.appendChild(this.getHorizontalSequencesElement(i, sequencesParams.horizontalSequences, sequencesParams.state));
      }

      for (var j = 0; j < picture[0].length; j++) {
        var cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.backgroundColor = picture[i][j];
        fragment.appendChild(cell);
      }
    }

    return fragment;
  };

  View.prototype.renderPicture = function (_a) {
    var picture = _a.picture,
        state = _a.state,
        horizontalSequences = _a.horizontalSequences,
        verticalSequences = _a.verticalSequences;

    if (this.element) {
      this.element.innerHTML = '';
      this.element.appendChild(this.getPictureElement({
        picture: picture,
        sequencesParams: {
          state: state,
          horizontalSequences: horizontalSequences,
          verticalSequences: verticalSequences
        }
      }));
    }
  };

  View.prototype.render = function (_a) {
    var state = _a.state,
        horizontalSequences = _a.horizontalSequences,
        verticalSequences = _a.verticalSequences,
        lifeCounter = _a.lifeCounter;

    if (this.lifeCounterElement) {
      var items = Array.prototype.slice.call(this.lifeCounterElement.querySelectorAll('.life-counter__item'));

      for (var i = 0; i < items.length; i++) {
        if (!(items[i] instanceof HTMLSpanElement)) {
          continue;
        }

        if (i < lifeCounter) {
          items[i].classList.add('life-counter__item_filled');
        } else {
          items[i].classList.remove('life-counter__item_filled');
        }
      }
    }

    if (this.element) {
      this.element.innerHTML = '';
      this.element.appendChild(this.getCornerCell()); // Render vertical sequences row

      this.element.appendChild(this.getAllVerticalSequencesElement(verticalSequences, state));

      for (var i = 0; i < state.length; i++) {
        // Render horizontal sequences cell
        this.element.appendChild(this.getHorizontalSequencesElement(i, horizontalSequences, state));

        for (var j = 0; j < state[0].length; j++) {
          var cell = document.createElement('div');
          cell.classList.add('cell');

          if (state[i][j] === 'colored') {
            cell.classList.add('cell_colored');
          }

          if (state[i][j] === 'crossed') {
            cell.classList.add('cell_crossed');
          }

          cell.dataset.i = String(i);
          cell.dataset.j = String(j);
          this.element.appendChild(cell);
        }
      }
    }
  };

  View.prototype.initHandlers = function (_a) {
    var handleCellClick = _a.handleCellClick,
        handleModeChange = _a.handleModeChange,
        handleNewGameButtonClick = _a.handleNewGameButtonClick,
        handleNextLevelButtonClick = _a.handleNextLevelButtonClick;

    if (this.element) {
      this.element.addEventListener('click', function (event) {
        if (!(event.target instanceof HTMLDivElement && event.target.classList.contains('cell'))) {
          return;
        }

        var i = Number(event.target.dataset.i);
        var j = Number(event.target.dataset.j);
        handleCellClick(i, j);
      });
    }

    if (this.buttonElement) {
      var cross_1 = this.buttonElement.querySelector('#cross');
      var square_1 = this.buttonElement.querySelector('#square');
      this.buttonElement.addEventListener('click', function (event) {
        if (!(event.currentTarget instanceof HTMLButtonElement)) {
          return;
        }

        if (event.currentTarget.getAttribute('aria-checked') === 'true') {
          handleModeChange('crossing');
          event.currentTarget.setAttribute('aria-checked', 'false');

          if (cross_1 && square_1) {
            cross_1.classList.add('mode-button__item_active');
            square_1.classList.remove('mode-button__item_active');
          }
        } else {
          handleModeChange('coloring');
          event.currentTarget.setAttribute('aria-checked', 'true');

          if (cross_1 && square_1) {
            square_1.classList.add('mode-button__item_active');
            cross_1.classList.remove('mode-button__item_active');
          }
        }
      });
    }

    if (this.endGameElement) {
      var newGameButton = this.endGameElement.querySelector('button');

      if (newGameButton) {
        newGameButton.addEventListener('click', function () {
          handleNewGameButtonClick();
        });
      }
    }

    if (this.victoryElement) {
      var nextLevelButton = this.victoryElement.querySelector('button');

      if (nextLevelButton) {
        nextLevelButton.addEventListener('click', function () {
          handleNextLevelButtonClick();
        });
      }
    }
  };

  return View;
}();

exports.View = View;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var game_1 = require("./game");

var view_1 = require("./view");

var element = document.querySelector('#field');
var modeButtonElement = document.querySelector('#mode-button');
var lifeCounterElement = document.querySelector('#life-counter');
var endGameElement = document.querySelector('#end-game');
var victoryElement = document.querySelector('#victory');
var data = [{
  title: 'lion',
  picture: [['#23A6FF', '#774218', '#774218', '#774218', '#23A6FF'], ['#F6B853', '#F6B853', '#F6B853', '#774218', '#23A6FF'], ['#F1B348', '#F1B348', '#F1B348', '#774218', '#23A6FF'], ['#23A6FF', '#633714', '#633714', '#774218', '#EEAF46'], ['#EEAF46', '#633714', '#EEAF46', '#EEAF46', '#F6B853']],
  field: [[0, 1, 1, 1, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 0], [0, 1, 1, 1, 1], [1, 1, 1, 1, 1]]
}, {
  title: 'rose',
  picture: [['#9B001E', '#B90628', '#B90628', '#B90628', '#9B001E'], ['#9B001E', '#B90628', '#AD0B2A', '#CA0028', '#9B001E'], ['#9B001E', '#CA0028', '#CA0028', '#CA0028', '#9B001E'], ['#DF1FFE', '#9B001E', '#9B001E', '#9B001E', '#DF1FFE'], ['#DF1FFE', '#DF1FFE', '#77E916', '#DF1FFE', '#DF1FFE']],
  field: [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]]
}];
var view = new view_1.View(element, modeButtonElement, lifeCounterElement, endGameElement, victoryElement);
var game = new game_1.Game(data, view);
game.init();
},{"./game":"src/game.ts","./view":"src/view.ts"}],"../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55125" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map