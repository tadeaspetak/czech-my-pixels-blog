import classnames from 'classnames';
import moment from 'moment';

import React from 'react';

import Image from './image';
import PostGallery from './postGallery';
import PostNavigation from './postNavigation';
import Utils from '../lib/utils';

/**
 * Post detail showing the banner, post content and also requiring its
 * subcomponents: navigation and gallery.
 */

export default class PostDetail extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    dispatch: React.PropTypes.func,
    post: React.PropTypes.shape({
      banner: React.PropTypes.shape({
        banner: React.PropTypes.string
      }),
      contentHtml: React.PropTypes.string,
      published: React.PropTypes.string,
      title: React.PropTypes.string
    })
  }
  render() {
    return (<div>
      {/* banner, outside of the actual post container (so that it can be full width) */}
      <div className="banner" style={{ backgroundImage: this.props.post.banner ? `url("${Utils.getDensityAwareUrl(this.props.post.banner.banner)}")` : false }} />
      <Image className="banner" alt="" src={this.props.post.banner ? Utils.getDensityAwareUrl(this.props.post.banner.banner) : ''} />
      <div id="post-container" className="container">
        <article id="post-contents" className="post">
          <div className="post-meta">
            <h1 className="post-heading">{this.props.post.title}</h1>
            <span className="post-details">
              <span className="post-details-date">{moment(this.props.post.published).format('MMM DD, YYYY')}</span>
            </span>
          </div>
          <div className={classnames('post-body')} dangerouslySetInnerHTML={{ __html: this.props.post.contentHtml }} />
        </article>
        <PostGallery
          dispatch={this.props.dispatch}
          post={this.props.post}
        />
        <PostNavigation
          postContents={this.refs.postContents}
          dispatch={this.props.dispatch}
          post={this.props.post}
        />
      </div>
    </div>);
  }
}
