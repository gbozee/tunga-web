import React from 'react';
import styled, {css} from 'styled-components'
import {Link} from 'react-router';

import SearchBox from '../components/SearchBox';
import Progress from '../components/status/Progress';
import LoadMore from '../components/status/LoadMore';
import Avatar from '../components/Avatar';
import ChannelInfo from '../components/ChannelInfo';
import UserSearchForm from '../components/UserSearchForm';
import connect from '../utils/connectors/ChannelConnector';

import {CHANNEL_TYPES} from '../constants/Api';
import {isAuthenticated, isAdmin} from '../utils/auth';

export function resizeOverviewBox() {
  var w_h = $(window).height();
  var nav_h = $('nav.navbar').height();
  var wf_h = $('.chat-head').height();
  var t_h = nav_h + wf_h + 90;

  if (w_h > t_h) {
    $('.chat-overview').css('height', w_h - t_h + 'px');
  }
}

const Div = styled.div`${props=>props.css}`

class MessagePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isShowing: false,
      isMobile: false,
      isFetching: false,
      list: { count: 0, ids: [] }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { Channel: { list } } = nextProps
    if (this.state.isFetching !== list.isFetching) {
      this.setState({
        isFetching: list.isFetching,
        list
      })
    }
  }

  componentWillMount() {
   
    this.mediaQueryList = window.matchMedia("(max-width: 768px)")
    this.mediaQueryList.addListener(this.updateMatches)
    this.updateMatches()
  }
  componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches)
  }
  updateMatches = () => this.setState({ isMobile: this.mediaQueryList.matches })
  componentDidMount() {
    resizeOverviewBox();
    $(window).resize(resizeOverviewBox);
    this.getChannels();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.route.path != prevProps.route.path) {
      this.getChannels();
    }
  }

  getChannels() {
    const {ChannelActions} = this.props;
    if (isAuthenticated()) {
      ChannelActions.listChannels({type: this.getChannelTypeFilter()});
    }
  }

  getChannelTypeFilter() {
    switch (this.props.route.path) {
      case 'help':
        return CHANNEL_TYPES.support;
      default:
        return null;
    }
  }

  toggleButton(){
    this.setState((prevState, props) => {
      return ({
        isShowing: !this.state.isShowing
      })
    });
  }

  renderChildren() {
    return React.Children.map(
      this.props.children,
      function(child) {
        return React.cloneElement(child, {
          Channel: this.props.Channel,
          Message: this.props.Message,
          ChannelActions: this.props.ChannelActions,
          MessageActions: this.props.MessageActions,
        });
      }.bind(this),
    );
  }

  render() {
    const {Channel, ChannelActions} = this.props;
    const channel_type_filter = this.getChannelTypeFilter();

    var right_component = (this.state.isShowing)
    ? <UserSearchForm {...this.props} toggleButton={() => this.toggleButton()} />
    : (channel_type_filter == CHANNEL_TYPES.support)
        ? null
        : <div className="pull-right btn-start">
            <a onClick={() => this.toggleButton()}>
              <i className="fa fa-plus" />{' '}
                {channel_type_filter == CHANNEL_TYPES.support
                ? 'Create a new inquiry'
                : 'Start a new conversation'}
            </a>
          </div>
    const chatList = this.props.location.pathname === '/conversation/start'
    const sideView = <SideBox isFetching={this.state.isFetching}
      list={this.state.list} channel_type_filter={channel_type_filter} {...this.props}
    />
    return (
      <div  id="chat-window">
        <div  className="col-lg-12 nopadding">

          <div className="col-md-6 col-sm-6 col-xs-6  nopadding">
            {
              isAuthenticated()
              ? <div className="chat-head">
                  <h2>
                    {channel_type_filter == CHANNEL_TYPES.support
                      ? 'Help'
                      : 'Messages'}
                  </h2>
                </div>
              : null
            }
          </div>

          <div className="col-md-6 col-sm-6 col-xs-6 nopadding">
            { right_component }
          </div>
          <div className="col-xs-12 nopadding"><hr style={{marginTop: 0}}/></div>
        </div>
        <div  className="col-xs-12 nopadding">
          {this.state.isMobile && chatList ? sideView :
          <Div css={css`
          display: flex;
          & .mainbox{
            @media(max-width: 768px){
              width: 100%;
            }
          }
          `} className="chat-overview overview">
            {isAuthenticated() && !this.state.isMobile &&
            (isAdmin() || channel_type_filter != CHANNEL_TYPES.support)
              ? sideView: null}
            <div className="mainbox">
              {this.renderChildren()}
            </div>
        </Div>
            }
        </div>
      </div>
    );
  }
}
const SideBoxStyles = styled.div`
@media(max-width: 768px){
  width: 100% !important;
}
`;
class SideBox extends React.Component {

  render() {

    const { ChannelActions, channel_type_filter, list, isFetching } = this.props;
    // debugger;
    return (<SideBoxStyles className="sidebox channelbox">
      <SearchBox
        placeholder="Search"
        onSearch={ChannelActions.listChannels}
        count={list.count}
        custom_class="search-box-group-custom"
      />
      {isFetching
        ? <Progress />
        : <div className="list-box">
          <div className="channel-list">
            {list.ids.map(id => {
              let channel = list.channels[id];
              return (
                <Link
                  key={id}
                  to={`${channel_type_filter ==
                    CHANNEL_TYPES.support
                    ? '/help'
                    : '/conversation'}/${channel.id}/`}
                  className="media"
                  activeClassName="active">
                  <div className="media-left">
                    <Avatar
                      src={
                        channel.user
                          ? channel.user.avatar_url
                          : null
                      }
                      icon={
                        channel.user ? null : 'glypichon-comment'
                      }
                      badge={channel.new || null}
                    />
                  </div>
                  <div className="media-body channel-details">
                    <ChannelInfo channel={channel} />
                  </div>
                </Link>
              );
            })}
          </div>
          <LoadMore
            url={list.next}
            callback={ChannelActions.listMoreChannels}
            loading={list.isFetchingMore}
            text="more"
          />
        </div>}
    </SideBoxStyles>

    );
  }
}
export default connect(MessagePage);
