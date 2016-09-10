import React, { Component } from 'react';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Search from 'grommet/components/Search';
import Logo from './Logo'; // './HPELogo';
import MakerMap from './MakerMap';

import { connect } from 'react-redux';
import { navActivate } from '../actions';


class MapView extends Component {

  constructor() {
    super();

    this._onClickTitle = this._onClickTitle.bind(this);
    this._onCloseNav = this._onCloseNav.bind(this);
    this._onClickSegment = this._onClickSegment.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);
    this.state = {mapWidth:500, mapHeight: 500};
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.nav.active !== nextProps.nav.active) {
      // The NavSidebar is changing, relayout when it finishes animating.
      // TODO: Convert to an animation event listener.
      this._onResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize() {
    // debounce
    clearTimeout(this._timer);
    this._timer = setTimeout(this._layout, 150);
  }

  _onClickTitle() {
    this.props.dispatch(navActivate(true));
  }

  _onCloseNav() {
    this.props.dispatch(navActivate(false));
  }

  _onClickSegment(tile, query) {
    this.props.dispatch(indexNav(tile.path, tile.category, query));
  }

  _onSearch(value) {
    if (value.hasOwnProperty('uri')) {
      // this is a suggestion
      this.props.dispatch(indexSelect(value.category, value.uri));
    } else {
      //this.props.dispatch(dashboardSearch(value));
    }
  }

  _layout() {
    let specs = this.refs.content.getBoundingClientRect();
    let dimensions = {
      mapWidth: specs.width,
      mapHeight: specs.height
    };
    this.setState(dimensions);
  }

  render () {
    const { searchText, searchSuggestions} = this.props.makermap;
    const { mapWidth, mapHeight } = this.state;
    const { active: navActive } = this.props.nav;

    let title;
    if (! navActive) {
      title = (
        <Title onClick={this._onClickTitle} a11yTitle="Open Menu">
          <Logo />
          MakerHub
        </Title>
      );

    }
    return (
      <div ref="content" className="dashboard">
        <Header direction="row" justify="between" large={true}
          pad={{horizontal: 'medium', between: 'small'}}>
          <div> {/* Wrap title in div to prevent it from getting truncated */}
            {title}
          </div>
          <Search ref="search" inline={true}
            placeHolder="Search" fill={true}
            defaultValue={searchText} onChange={this._onSearch}
            suggestions={searchSuggestions} />
        </Header>
        <MakerMap width={mapWidth} height={mapHeight}/>
      </div>
    );
  }
};

let select = (state) => {
  return ({ makermap: state.makermap, nav: state.nav });
};

export default connect(select)(MapView);
