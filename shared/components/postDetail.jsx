import React from 'react';
import Utils from 'lib/utils';
import classnames from 'classnames';
import moment from 'moment';
import PostGallery from 'components/postGallery.jsx';
import PostNavigation from 'components/postNavigation.jsx';

/**
 * Post detail showing the banner, post content and also including its
 * subcomponents: navigation and gallery.
 */

export default class PostDetail extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.state = {
      isShownFull: false,
      isReadOnNecessary: false
    };
  }
  componentDidUpdate(){
    this.resolveReadOn();
  }
  resolveReadOn(){
    //execute only on client
    /*if(process.env.BROWSER){
      let postBody = document.getElementsByClassName("post-body")[0];
      if(postBody && this.state.isReadOnNecessary !== postBody.scrollHeight > postBody.offsetHeight){
        this.setState({isReadOnNecessary: postBody.scrollHeight > postBody.offsetHeight});
      }
    }*/
  }
  render() {
    return (<div>
      {/* banner */}
      <div className="banner" style={{backgroundImage: this.props.post.banner ? `url("${Utils.getDensityAwareUrl(this.props.post.banner.banner)}")` : false}} />
      <img className="banner" alt="" src={this.props.post.banner ? Utils.getDensityAwareUrl(this.props.post.banner.banner) : ''} />
      <div id="post-container" className="container">
        <article id="post-contents" className="post">
          {/* post meta*/}
          <div className="post-meta">
            <h1 className="post-heading">{this.props.post.title}</h1>
            <span className="post-details">
              Published on <span className="post-details-date">{moment(this.props.post.date).format('MMM DD, YYYY')}</span>
            </span>
          </div>
          {/* post body & show more button */}
          <div
            className={classnames('post-body', {'full': this.state.isShownFull})}
            dangerouslySetInnerHTML={{__html: this.props.post.contentHtml}}></div>
          {/* <div className={classnames('show-more', {'visible': !this.state.isShownFull && this.state.isReadOnNecessary})}>
            <a className="button show-more" onClick={() => this.setState({isShownFull: true})}><i className="fa fa-level-down" />... read on!</a>
          </div> */}
        </article>
        <PostGallery
          dispatch={this.props.dispatch}
          slug={this.props.slug}
          posts={this.props.posts}
          post={this.props.post} />
        <PostNavigation
          dispatch={this.props.dispatch}
          post={this.props.post}/>
      </div>
    </div>)
  }
}