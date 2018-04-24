import Util from './util';
import {
  PROCESS_START,
  PROCESS_DONE,
  PROCESS_ERROR,
} from '../constants';

/**
 * style观察者
 * @return {Observer}
 */
const styleObserver = () => {
  const replace = 'replace';
  const done = 'done';
  const error = 'error';

  return {
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
  };
};

/**
 * @class
 * @implements {Util}
 */
class ImageLoader extends Util {
  /**
   * 加载图片
   * @param {HTMLElement} loader - 正在操作的loader
   * @private
   */
  static loadImage(loader) {
    const reserved = ['src', 'alt', 'crossorigin'];

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.classList.add('image', 'image--full');

      Object.entries(loader.dataset).forEach(([key, val]) => {
        if (reserved.includes(key)) {
          img[key] = val;
        } else {
          img.dataset[key] = val;
        }
      });

      img.onload = (e) => {
        resolve(e.target);
      };

      img.onerror = () => {
        reject(img.src);
      };
    });
  }

  /**
   * 新建Menu实例
   * @param {string} [group] - 组件分类
   * @augments {Util}
   */
  constructor(group) {
    super(group);

    /**
     * 所有image-loader组件，live HTMLCollection
     * @type {HTMLCollection}
     * @public
     */
    this.loaders = document.getElementsByClassName('image-loader replace');

    // 添加默认observer
    this.attach(styleObserver());
  }

  /**
   * loader加载成功
   * @param {HTMLElement} loader - 成功的loader
   * @param {HTMLImageElement} image - 写入的Image对象
   * @private
   */
  done(loader, image) {
    loader.appendChild(image);

    this.subject.state = {
      loader,
      status: PROCESS_DONE,
    };
  }

  /**
   * loader加载失败
   * @param {HTMLElement} loader - 失败的loader
   * @private
   */
  error(loader) {
    this.subject.state = {
      loader,
      status: PROCESS_ERROR,
    };
  }

  /**
   * 延时加载，遍历loaders查找符合条件loader
   * @return {Promise}
   * @public
   */
  lazyload() {
    const loaders = Array.from(this.loaders).map((loader) => {
      if (this.constructor.inview(loader)) {
        this.subject.state = {
          loader,
          status: PROCESS_START,
        };

        return this.constructor.loadImage(loader).then((image) => {
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
    });

    return Promise.all(loaders);
  }
}

export default ImageLoader;
