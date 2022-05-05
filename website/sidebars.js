/**
 * @file
 */

module.exports = {
    guide: [
        'quick-start',
        {
          type: 'category',
          label: '指南',
          link: {
            type: 'generated-index',
          },
          items: [
            "guide/add-route",
            "guide/dynamic-route-matching",
            "guide/nested-routes",
            "guide/lazy-loading-routes",
            "guide/programmatic-navigation",
            "guide/navigation-guards"
          ],
        },
        'api',
        'data-structure'
    ],
}
