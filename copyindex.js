const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const shortid = require('shortid');

const pages = {
  index: {
    file: 'index.hbs',
    data: {
      title: 'UI',
      legacy: false,
    },
  },
  legacy: {
    file: 'legacy.hbs',
    data: {
      title: 'UI - legacy',
      legacy: true,
    },
  },
};

const context = {
  version: shortid.generate(),
};

/**
 * 注册Partial
 * @param {String} template 模版文件名称
 * @param {String} name Partial名称
 */
function registerPartials(template, name) {
  const hbs = path.resolve(__dirname, 'views', template);
  const source = fs.readFileSync(hbs, 'utf8');

  Handlebars.registerPartial(name, source);
}

const layout = path.resolve(__dirname, 'views', 'layouts/main.hbs');
const source = fs.readFileSync(layout, 'utf8');
const template = Handlebars.compile(source);

// partials.forEach((partial) => {
//   const { file, name } = partial;

//   registerPartials(file, name);
// });

Object.keys(pages).forEach((page) => {
  const indexTo = `example/${page}.html`;
  const { file, data } = pages[page];

  // Page
  registerPartials(file, 'App');

  const pageContext = Object.assign({}, context, data, { page });
  const temp = template(pageContext);

  fs.writeFileSync(indexTo, temp, 'utf8');
});
