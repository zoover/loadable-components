'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var hoistNonReactStatics = _interopDefault(require('hoist-non-react-statics'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var components = {};

var track = function track(component, modules) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var id = modules.join('-');
  if (index) id += '-' + index;
  if (components[id]) {
    return track(component, modules, index + 1);
  }
  components[id] = component;
  return id;
};

var get$1 = function get$$1(id) {
  return components[id];
};
var getAll = function getAll() {
  return _extends({}, components);
};
var reset = function reset() {
  components = {};
};

var tracker = /*#__PURE__*/Object.freeze({
  track: track,
  get: get$1,
  getAll: getAll,
  reset: reset
});

var LOADABLE_STATE = '__LOADABLE_STATE__';
var LOADABLE = '@@loadable-components/loadable';

/* eslint-env browser */

function loadState(rootState) {
  if (!rootState.children) return Promise.resolve(null);

  return Promise.all(rootState.children.map(function (state) {
    var component = get$1(state.id);

    if (!component) {
      console.warn('loadable-component client modules:', getAll());
      console.warn('loadable-component server modules:', window[LOADABLE_STATE]);
      throw new Error('loadable-components: module "' + state.id + '" is not found, client and server modules are not sync. You are probably not using the same resolver on server and client.');
    }

    var getLoadable = component[LOADABLE];

    if (typeof getLoadable !== 'function') {
      throw new Error('loadable-components: module "' + state.id + '" is not a loadable component, please verify your SSR setup');
    }

    return getLoadable().load().then(function () {
      return loadState(state);
    });
  }));
}

function loadComponents() {
  if (typeof window === 'undefined') {
    throw new Error('loadable-components: `loadComponents` must be called client-side: `window` is undefined');
  }

  var state = window[LOADABLE_STATE];
  if (!state) {
    throw new Error('loadable-components state not found. ' + 'You have a problem server-side. ' + 'Please verify that you have called `loadableState.getScriptTag()` server-side.');
  }

  return loadState(state);
}

/* eslint-env browser */

function getState() {
  var _ref;

  var componentByIds = getAll();
  var children = Object.keys(componentByIds).reduce(function (ids, id) {
    var component = componentByIds[id];
    if (component.loadingPromise) return [].concat(ids, [{ id: component.componentId }]);
    return ids;
  }, []);
  return _ref = {}, _ref[LOADABLE_STATE] = { children: children }, _ref;
}

/* eslint-disable no-underscore-dangle */
var resolveModuleDefault = function resolveModuleDefault(module) {
  return module.__esModule ? module.default : module;
};

/* eslint-disable react/sort-comp */

var EmptyComponent = function EmptyComponent() {
  return null;
};

function loadable(getComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$ErrorComponent = _ref.ErrorComponent,
      ErrorComponent = _ref$ErrorComponent === undefined ? EmptyComponent : _ref$ErrorComponent,
      _ref$LoadingComponent = _ref.LoadingComponent,
      LoadingComponent = _ref$LoadingComponent === undefined ? EmptyComponent : _ref$LoadingComponent,
      _render = _ref.render,
      modules = _ref.modules,
      asyncMode = _ref.asyncMode;

  var LoadableComponent = function (_React$Component) {
    inherits(LoadableComponent, _React$Component);

    LoadableComponent.load = function load() {
      if (!LoadableComponent.loadingPromise) {
        LoadableComponent.loadingPromise = getComponent().then(function (module) {
          var _hoistNonReactStatics;

          var Component = resolveModuleDefault(module);
          LoadableComponent.Component = Component;
          hoistNonReactStatics(LoadableComponent, Component, (_hoistNonReactStatics = {
            Component: true,
            loadingPromise: true,
            load: true
          }, _hoistNonReactStatics[LOADABLE] = true, _hoistNonReactStatics.componentId = true, _hoistNonReactStatics));
          return Component;
        }).catch(function (error) {
          LoadableComponent.loadingPromise = null;
          throw error;
        });
      }

      return LoadableComponent.loadingPromise;
    };

    function LoadableComponent(props) {
      classCallCheck(this, LoadableComponent);

      var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = {
        Component: LoadableComponent.Component,
        error: null,
        loading: !LoadableComponent.Component
      };
      _this.mounted = false;
      _this.loadingPromise = null;

      if (typeof window !== 'undefined' && _this.state.Component === null && _this.loadingPromise === null) {
        _this.loadingPromise = LoadableComponent.load().then(function (Component) {
          _this.safeSetState({ Component: Component, loading: false });
        }).catch(function (error) {
          _this.safeSetState({ error: error, loading: false });
        });
      }
      return _this;
    }

    LoadableComponent.prototype.componentDidMount = function componentDidMount() {
      this.mounted = true;
    };

    LoadableComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
    };

    LoadableComponent.prototype.safeSetState = function safeSetState(state) {
      if (!this.mounted) return;
      this.setState(state);
    };

    LoadableComponent.prototype.render = function render() {
      var _state = this.state,
          Component = _state.Component,
          error = _state.error;


      if (typeof _render === 'function') {
        return _render(_extends({}, this.state, {
          ownProps: this.props
        }));
      }

      if (Component !== null) {
        return React.createElement(Component, this.props);
      }

      if (error !== null) {
        return React.createElement(ErrorComponent, { error: error, ownProps: this.props });
      }

      if (asyncMode) {
        throw this.loadingPromise;
      }

      return React.createElement(LoadingComponent, this.props);
    };

    return LoadableComponent;
  }(React.Component);

  LoadableComponent.Component = null;
  LoadableComponent.loadingPromise = null;


  LoadableComponent[LOADABLE] = function () {
    return LoadableComponent;
  };

  if (modules) {
    var id = track(LoadableComponent, modules);
    LoadableComponent.modules = modules;
    LoadableComponent.componentId = id;
  }

  return LoadableComponent;
}

var componentTracker = tracker;

exports.componentTracker = componentTracker;
exports.loadComponents = loadComponents;
exports.getState = getState;
exports.LOADABLE = LOADABLE;
exports.default = loadable;
//# sourceMappingURL=loadable-components.cjs.js.map
