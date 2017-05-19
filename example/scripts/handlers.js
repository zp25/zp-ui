import 'babel-polyfill';

const createClickHandler = (components) => {
  const { mask, carousel } = components;

  /**
   * mask panel显示提示消息
   * @param {string} [msg='prompt'] - 提示消息
   */
  const message = (msg) => {
    mask.prompt('message', msg);
  };

  /**
   * 启动loading
   */
  const loading = () => {
    mask.loading();
  };

  /**
   * mask panel提示消息效果
   */
  const prompt = (e) => {
    e.preventDefault();

    message('可填写3行提示信息');
  };

  /**
   * mask panel切换效果
   */
  const switching = () => {
    loading();

    setTimeout(() => {
      message('Loading结束');
    }, 2000);
  };

  /**
   * 关闭mask
   */
  const close = (e) => {
    e.preventDefault();

    mask.hide();
  };

  /**
   * 轮播自定义导航
   */
  const customNav = (e) => {
    e.preventDefault();

    const reverse = e.target.dataset.reverse === 'true';
    carousel.play(reverse);
  };

  /**
   * 取消默认动作
   */
  const pass = (e) => {
    e.preventDefault();
  };

  return {
    loading,
    prompt,
    switching,
    close,
    customNav,
    pass,
  };
};

export default createClickHandler;
