import 'babel-polyfill';
import Template from './templates';

export default () => {
  const $ = document.querySelector.bind(document);

  // carousel banner配置
  const list = [
    {
      order: 1,
    },
    {
      order: 2,
    },
    {
      order: 3,
    },
  ];

  /**
   * 轮播
   */
  const carousel = () => {
    const result = Template.carousel({ list });
    $('.demo--carousel').insertAdjacentHTML('afterbegin', result);
  };

  /**
   * 轮播精简版
   */
  const carouselLite = () => {
    const result = Template.carouselLite({ list });
    $('.demo--carousel-lite').insertAdjacentHTML('afterbegin', result);
  };

  const panel = () => {
    const result = Template.panel({
      title: 'Header',
      body: 'Body',
    });

    $('.demo--panel').insertAdjacentHTML('afterbegin', result);
  };

  const mask = () => {
    const result = Template.mask({
      loading: '填写提示信息',
      message: '填写提示信息',
    });

    $('.demo--mask').insertAdjacentHTML('afterbegin', result);
  };

  const menu = () => {
    const result = Template.menu({
      page: [
        {
          id: 1,
          title: 'List A',
          data: [
            {
              content: 'List A - 1',
            },
            {
              content: 'List A - 2',
            },
          ],
        },
        {
          id: 2,
          title: 'List B',
          data: [
            {
              content: 'List B - 1',
            },
            {
              content: 'List B - 2',
            },
          ],
        },
      ],
    });

    $('.demo--menu').insertAdjacentHTML('afterbegin', result);
  };

  return {
    carousel,
    carouselLite,
    panel,
    mask,
    menu,
  };
};
