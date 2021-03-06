var Electron = require('electron');
var Remote = Electron.remote;
var App = Remote.app;

var React = require('react');

var SearchbarContainer = require('../searchbar/container');
var DownloadManager = require('../../../modules/DownloadManager');
var KakuCore = require('../../../modules/KakuCore');

var ToolbarContainer = React.createClass({
  getInitialState: function() {
    return {
      downloadPercent: 0,
      title: ''
    };
  },

  componentDidMount: function() {
    this.setState({
      title: KakuCore.title
    });

    KakuCore.on('titleUpdated', (title) => {
      this.setState({
        title: title
      });
    });

    DownloadManager.on('download-progress', (percent) => {
      this._processDownloadProgress(percent);
    });

    DownloadManager.on('download-finish', () => {
      this._processDownloadProgress(0);
    });

    DownloadManager.on('download-error', () => {
      this._processDownloadProgress(0);
    });
  },

  _onCloseButtonClick: function() {
    App.quit();
  },

  _onShrinkButtonClick: function() {
    Remote.getCurrentWindow().minimize();
  },

  _onEnlargeButtonClick: function() {
    var win = Remote.getCurrentWindow();
    if (win.isMaximized()) {
      win.unmaximize();
    }
    else {
      win.maximize();
    }
  },

  _processDownloadProgress: function(percent) {
    this.setState({
      downloadPercent: percent
    });
  },

  render: function() {
    var title = this.state.title;
    var downloadPercent = this.state.downloadPercent;

    var progressStyle = {
      width: downloadPercent + '%'
    };

    /* jshint ignore:start */
    return (
      <div className="toolbar-container clearfix">
        <div className="toolbar-buttons">
          <span
            className="button close-button"
            onClick={this._onCloseButtonClick}>
              <i className="fa fa-times"></i>
          </span>
          <span
            className="button shrink-button"
            onClick={this._onShrinkButtonClick}>
              <i className="fa fa-minus"></i>
          </span>
          <span
            className="button enlarge-button"
            onClick={this._onEnlargeButtonClick}>
              <i className="fa fa-plus"></i>
          </span>
        </div>
        <div className="toolbar-song-information">
          {title}
        </div>
        <div className="searchbar-slot">
          <SearchbarContainer/>
        </div>
        <div className="toolbar-progressbar" style={progressStyle}></div>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = ToolbarContainer;
