import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostActions from 'actions/PostActions';
import { Map } from 'immutable';
import classnames from 'classnames';
import nprogress from 'nprogress';

/**
 * Picture detail.
 */

@connect(state => ({posts: state.posts}))
//@needs([params => PostActions.getPost(params.slug)])
export default class Picture extends React.Component {
  //router is required for this component
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.state = {};

    //significant key map
    this.keyMap = new Map()
      //close on escape
      .set(27, () => this.handleOverlayClick.bind(this)())
      //previous on left arrow
      .set(37, () => this.handleGotoPrevious.bind(this)())
      //next on right arrow
      .set(39, () => this.handleGotoNext.bind(this)());

    //handlers
    this.onResize = this.normalizeDimensions.bind(this);
    this.onKeyup = this.handleKeyup.bind(this);

    //index of this picture in the `pictures` array of the post it pertains to
    this.index = this.getPictures().findIndex(picture => picture.name === this.props.params.picture);

  }
  componentDidMount(){
    let {picture} = this.getDOMElements();
    if(picture.offsetWidth === 0){
      let listener = e => {
        this.normalizeDimensions.bind(this)();
        picture.removeEventListener('load', listener);
      }
      picture.addEventListener('load', listener);
    } else {
      this.normalizeDimensions();
    }

    window.addEventListener('resize', this.onResize);
    window.addEventListener('keyup', this.onKeyup);
  }
  componentWillUnmount(){
    //remove event listeners
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keyup', this.onKeyup);
  }
  getPictures(){
    return this.props.posts.get(this.props.params.slug).pictures;
  }
  getPicture(){
    return this.getPictures()[this.index];
  }
  handleGotoNext(){
    let next = this.getPictures().length <= this.index + 1 ? false : this.getPictures()[this.index + 1];
    if(next){
      nprogress.start();
      this.preloadPicture(next.content).then(image => {
        this.props.dispatch(PostActions.changePicture('next'));
        this.setState({leavingForNext: true});
        this.context.router.push(`post/${this.props.params.slug}/${next.name}`);

        nprogress.done();
      });
    } else {
      this.handleOverlayClick();
    }
  }
  handleGotoPrevious(){
    let previous = this.index - 1 < 0 ? false : this.getPictures()[this.index - 1];
    if(previous){
      nprogress.start();
      this.preloadPicture(previous.content).then(image => {
        this.props.dispatch(PostActions.changePicture('previous'));
        this.setState({leavingForPrevious: true});
        this.context.router.push(`post/${this.props.params.slug}/${previous.name}`);

        nprogress.done();
      });
    } else {
      this.handleOverlayClick();
    }
  }
  preloadPicture(url){
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = url;

      resolve(image);
    });
  }
  handleOverlayClick(){
    this.context.router.push(`post/${this.props.params.slug}`);
  }
  handleKeyup(e){
    if(this.keyMap.has(e.keyCode)){
      this.keyMap.get(e.keyCode)();
    }
  }
  normalizeDimensions(){
    let {container, picture, comment} = this.getDOMElements();

    picture.style.width = 'auto';
    picture.style.height = 'auto';
    container.style.width = 'auto';
    container.style.height = 'auto';

    if(picture.offsetHeight > container.offsetHeight){
      picture.style.height = `${container.offsetHeight}px`;
    }

    container.style.width = `${picture.offsetWidth}px`;
    container.style.height = `${picture.offsetHeight}px`;

    //picture comment
    comment.className = classnames('comment', {visible: this.getPicture().html});
  }
  getDOMElements(){
    let container = document.getElementsByClassName('modal-picture')[0];
    let picture = container.childNodes[0];
    let comment = container.childNodes[1];

    return {container, picture, comment};
  }
  render() {
    return(
      <div className={classnames(
          'modal-picture',
          {'leaving-for-previous': this.state.leavingForPrevious},
          {'leaving-for-next': this.state.leavingForNext},
          {'entering-as-previous': this.props.posts.get('change-picture-direction') === 'previous'},
          {'entering-as-next': this.props.posts.get('change-picture-direction') === 'next'}
      )}>
        <img src={this.getPicture().content} />
        <div className={classnames('comment')} dangerouslySetInnerHTML={{__html: this.getPicture().html}}></div>
      </div>
    )
  }
}
