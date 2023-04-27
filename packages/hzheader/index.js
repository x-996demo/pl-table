import HzHeader from './src/hzheader';


/* istanbul ignore next */
HzHeader.install = function(Vue) {
  Vue.component(HzHeader.name, HzHeader);
};

export default HzHeader;
