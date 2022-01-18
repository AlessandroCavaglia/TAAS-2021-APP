import { Dimensions } from 'react-native';

module.exports = {
  /**
   * CSS vh ditto. Returns in pixels a fraction of the viewport height.
   * 
   * @param {Number} percentage
   * @return {Number} percentage of the window view height in value of pixels.
  */
  vh: (percentage) => {
    const viewportHeight = Dimensions.get('window').height;
    const decimal = percentage * .01;
    percentage = parseInt(percentage, 10);

    // Hard limits
    if (percentage < 0) {
      percentage = 100;
    }
    if (percentage > 1000) {
      percentage = 1000;
    }

    return Math.round(viewportHeight * decimal);
  },
  /**
   * CSS vw ditto. Returns in pixels a fraction of the viewport width.
   * 
   * @param {Number} percentage
   * @return {Number} percentage of the window view width in value of pixels.
  */
  vw: (percentage) => {
    const viewportWidth = Dimensions.get('window').width;
    const decimal = percentage * .01;
    percentage = parseInt(percentage, 10);

    // Hard limits
    if (percentage < 0) {
      percentage = 100;
    }
    if (percentage > 1000) {
      percentage = 1000;
    }

    return Math.round(viewportWidth * decimal);
  }
}