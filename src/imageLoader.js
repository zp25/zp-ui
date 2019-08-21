/* eslint no-underscore-dangle: ["error", { "allow": ["_options"] }] */

import Group from './group';
import {
  PROCESS_START,
  PROCESS_DONE,
  PROCESS_ERROR,
} from '../constants';

/**
 * style观察者
 * @return {Observer}
 */
const styleObserver = ({
  replace = 'replace',
  done = 'done',
  error = 'error',
}) => ({
  /**
   * 控制image-loader样式
   * @param {Object} state - 状态
   * @param {HTMLElement} state.loader - 需加载的对象
   * @param {number} status - 当前处于的加载阶段
   * @ignore
   */
  update: (state) => {
    const {
      loader,
      status,
    } = state;

    if (status === PROCESS_START) {
      // 立即将loader移出loaders
      loader.classList.remove(replace);
    } else if (status === PROCESS_DONE) {
      // 隐藏thumbnail
      loader.classList.add(done);
    } else if (status === PROCESS_ERROR) {
      loader.classList.add(error);
    }
  },
});

/**
 * @class
 * @implements {Group}
 */
class ImageLoader extends Group {
  /**
   * 元素是否在y轴可视范围内
   * @param {HTMLElement} item - 需要检测是否在可视范围的元素
   * @return {boolean}
   */
  static inview(item) {
    const rect = item.getBoundingClientRect();
    const itemT = rect.top;
    const itemB = itemT + rect.height;

    return itemB > 0 && itemT < window.innerHeight;
  }

  /**
   * 加载图片
   * @param {HTMLElement} loader - 正在操作的loader
   * @param {string} [className='image'] - 图片要添加的类名
   * @private
   */
  static loadImage(loader, className = 'image') {
    const reserved = ['src', 'alt', 'crossorigin'];

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.classList.add(className, `${className}--full`);

      Object.entries(loader.dataset).forEach(([key, val]) => {
        if (reserved.includes(key)) {
          img[key] = val;
        } else {
          img.dataset[key] = val;
        }
      });

      img.onload = () => {
        resolve(img);
      };

      img.onerror = () => {
        reject(img.src);
      };
    });
  }

  /**
   * 新建ImageLoader实例
   * @param {string} [group='main'] - 组件分类
   * @param {Object} [opts={}] - 配置
   * @param {string} [opts.replace='replace'] - 未完成替换元素的类名
   * @param {string} [opts.done='done'] - 替换成功元素的类名
   * @param {string} [opts.error='error'] - 替换失败元素的类名
   * @param {string} [opts.image='image'] - 图片类名
   * @augments {Group}
   */
  constructor(group = 'main', opts = {}) {
    super(group);

    if (typeof opts !== 'object' || !opts) {
      throw new TypeError('not an Object');
    }

    const {
      replace = 'replace',
      done = 'done',
      error = 'error',
      image = 'image',
    } = opts;

    this._options = {
      replace,
      done,
      error,
      image,
    };

    Object.freeze(this._options);

    /**
     * 状态
     * @type {Object}
     * @property {HTMLElement} loader - 当前loader
     * @property {number} status - 当前loader所处状态
     */
    this.state = {
      loader: null,
      status: PROCESS_DONE,
    };

    // 添加默认observer
    this.attach(styleObserver(this.options));
  }

  /**
   * 读取配置
   * @type {Object}
   * @property {string} replace - 未完成替换元素的类名
   * @property {string} done - 替换成功元素的类名
   * @property {string} error - 替换失败元素的类名
   * @property {string} image - 图片类名
   * @desc 初始化后不应该被修改，为避免修改而添加getter
   * @public
   */
  get options() {
    return { ...this._options };
  }

  /**
   * loader加载成功
   * @param {HTMLElement} loader - 成功的loader
   * @param {HTMLImageElement} image - 写入的Image对象
   * @private
   */
  done(loader, image) {
    loader.appendChild(image);

    this.setState({
      loader,
      status: PROCESS_DONE,
    });
  }

  /**
   * loader加载失败
   * @param {HTMLElement} loader - 失败的loader
   * @private
   */
  error(loader) {
    this.setState({
      loader,
      status: PROCESS_ERROR,
    });
  }

  /**
   * 延时加载，遍历loaders查找符合条件loader
   * @param {string} [className='image-loader'] - 目标元素类名
   * @return {Promise}
   * @public
   */
  load(className = 'image-loader') {
    const {
      replace,
      image: imgName,
    } = this.options;

    const list = Array.from(
      document.getElementsByClassName(`${className} ${replace}`),
    );

    return Promise.all(list.map((loader) => {
      if (this.constructor.inview(loader)) {
        this.setState({
          loader,
          status: PROCESS_START,
        });

        return this.constructor.loadImage(loader, imgName).then((image) => {
          this.done(loader, image);

          return {
            src: image.src,
            done: true,
          };
        }, (src) => {
          this.error(loader);

          return {
            src,
            error: true,
          };
        });
      }

      return false;
    }));
  }
}

export default ImageLoader;
export {
  styleObserver,
};
