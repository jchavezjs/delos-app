const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#2C1361',
              '@border-radius-base': 0,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
