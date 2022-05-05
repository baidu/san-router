const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const path = require('path');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
    module.exports = {
        title: 'San Router',
        tagline: '',
        staticDirectories: [path.resolve(__dirname, './static')],

        url: 'https://baidu.github.io/', // Your website URL
        baseUrl: '/san-router/',

        projectName: 'SanRouter', // Usually your repo name.
        organizationName: 'baidu', // Usually your GitHub org/user name.

        onBrokenLinks: 'ignore',
        onBrokenMarkdownLinks: 'warn',
        favicon: 'img/favicon.ico',

        presets: [
            [
                '@docusaurus/preset-classic',
                /** @type {import('@docusaurus/preset-classic').Options} */
                ({
                    pages: {
                        path: path.resolve(__dirname, './src/pages'),
                    },
                    docs: {
                        sidebarCollapsed: false,
                        path: path.resolve(__dirname, './docs'),
                        sidebarPath: path.resolve(__dirname, './sidebars.js'),
                        // Please change this to your repo.
                        editUrl:
                            'https://github.com/baidu/san-router/blob/master',
                    },
                    theme: {
                        customCss: path.resolve(__dirname, './src/css/custom.css'),
                    },
                }),
            ],
        ],

        themeConfig:
            /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
            ({
                navbar: {
                    title: 'San Router',
                    items: [
                        {
                            href: 'https://github.com/baidu/san-router',
                            label: 'GitHub',
                            position: 'right',
                        },
                    ],
                },
                prism: {
                    theme: lightCodeTheme,
                    darkTheme: darkCodeTheme,
                },
            }),
    }
);
