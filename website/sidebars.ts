import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quickstart',
        'getting-started/installation',
        'getting-started/project-tour',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/architecture',
        'concepts/data-model',
        'concepts/access-types',
        'concepts/print-optimizer',
        'concepts/revenue-split',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/seed-the-catalog',
        'guides/add-a-game',
        'guides/customize-pricing',
        'guides/testing',
        'guides/deploying',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/configuration',
        'reference/constants',
        'reference/database-schema',
        'reference/scripts',
        'reference/types',
      ],
    },
    'why',
    'troubleshooting',
    'contributing',
    'changelog',
  ],
};

export default sidebars;
