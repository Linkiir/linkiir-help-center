import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  linkiirSidebar: [
    'index',
    {
      type: 'category', label: 'Getting Started', link: {type: 'doc', id: 'getting-started/index'},
      items: [
        'getting-started/platform-overview',
        'getting-started/quick-install',
        'getting-started/first-login',
        'getting-started/demo-project',
      ],
    },
    {
      type: 'category', label: 'Administration', link: {type: 'doc', id: 'administration/index'},
      items: [
        {type: 'category', label: 'Installation', link: {type: 'doc', id: 'administration/installation/index'}, items: [
          'administration/installation/windows', 'administration/installation/linux', 'administration/installation/macos',
        ]},
        {type: 'category', label: 'Licensing', link: {type: 'doc', id: 'administration/licensing/index'}, items: [
          'administration/licensing/license-types', 'administration/licensing/license-id-code',
          'administration/licensing/capacity-and-expiry', 'administration/licensing/license-transfer',
        ]},
        {type: 'category', label: 'Upgrades', link: {type: 'doc', id: 'administration/upgrades/index'}, items: [
          'administration/upgrades/windows', 'administration/upgrades/linux', 'administration/upgrades/macos',
        ]},
        {type: 'category', label: 'Deployment', link: {type: 'doc', id: 'administration/deployment/index'}, items: [
          'administration/deployment/dev', 'administration/deployment/test', 'administration/deployment/prod',
          'administration/deployment/ha', 'administration/deployment/import-export',
        ]},
        {type: 'category', label: 'Configurations', link: {type: 'doc', id: 'administration/configurations/index'}, items: [
          'administration/configurations/project-settings', 'administration/configurations/user-roles',
          'administration/configurations/migration',
          'administration/configurations/http-server',
          'administration/configurations/log-archive-database',
          'administration/configurations/log-retention-purge', 'administration/configurations/kafka-redpanda',
        ]},
        'administration/logs/index',
        'administration/backup-restore/index',
        {type: 'category', label: 'Alerting and Notifications', link: {type: 'doc', id: 'administration/notifications/index'}, items: [
          'administration/notifications/settings',
        ]},
        'administration/security/index',
        {type: 'category', label: 'Troubleshooting', link: {type: 'doc', id: 'administration/troubleshooting/index'}, items: [
          'administration/troubleshooting/runtime-crash', 'administration/troubleshooting/crash-report',
          'administration/troubleshooting/log-archiver-connectivity',
        ]},
      ],
    },
    {
      type: 'category', label: 'Interface Development', link: {type: 'doc', id: 'interface-development/index'},
      items: [
        'interface-development/architecture',
        {type: 'category', label: 'Interfaces and Core Nodes', link: {type: 'doc', id: 'interface-development/interfaces/index'}, items: [
          'interface-development/interfaces/source-nodes', 'interface-development/interfaces/destination-nodes',
          'interface-development/interfaces/custom-scripting-nodes',
        ]},
        {type: 'category', label: 'Sample Code', link: {type: 'doc', id: 'interface-development/sample-code/index'}, items: [
          'interface-development/sample-code/http-source-demo', 'interface-development/sample-code/hl7-llp-scripting-llp',
        ]},
        {type: 'category', label: 'Lua Programming', link: {type: 'doc', id: 'interface-development/lua-programming/index'}, items: [
          'interface-development/lua-programming/testing-debugging',
          'interface-development/lua-programming/code-sets',
        ]},
        'interface-development/error-handling',
      ],
    },
    {
      // Adapters are grouped by the catalog that publishes them, so the sidebar
      // matches what a customer subscribes to. The adapter pages themselves stay
      // at /docs/adapters/<name> — the grouping is sidebar-only, so no existing
      // URL moves.
      type: 'category', label: 'Adapters', link: {type: 'doc', id: 'adapters/index'},
      items: [
        'adapters/how-adapters-work',
        {
          type: 'category', label: 'Adapter Catalogs',
          link: {type: 'doc', id: 'adapters/catalogs/index'},
          items: [
            {type: 'category', label: 'FHIR Adapters', link: {type: 'doc', id: 'adapters/catalogs/fhir'}, items: [
              'adapters/epic',
              'adapters/cerner',
              'adapters/ecw',
              'adapters/modmed',
              'adapters/athena',
              'adapters/fhir-resource-creator',
              'adapters/fhir-profiling-tools',
            ]},
            {type: 'category', label: 'EHR Adapters', link: {type: 'doc', id: 'adapters/catalogs/ehr'}, items: [
              'adapters/pointclickcare',
            ]},
            {type: 'category', label: 'Diagnostics Adapters', link: {type: 'doc', id: 'adapters/catalogs/diagnostics'}, items: [
              'adapters/dexcom',
            ]},
            {type: 'category', label: 'Business Adapters', link: {type: 'doc', id: 'adapters/catalogs/business'}, items: [
              'adapters/salesforce',
              'adapters/dynamics-365',
            ]},
            {type: 'category', label: 'Transport Adapters', link: {type: 'doc', id: 'adapters/catalogs/transport'}, items: [
              'adapters/aws-s3',
            ]},
            {type: 'category', label: 'Notification Adapters', link: {type: 'doc', id: 'adapters/catalogs/notification'}, items: [
              'adapters/slack',
            ]},
            {type: 'category', label: 'AI Adapters', link: {type: 'doc', id: 'adapters/catalogs/ai'}, items: [
              'adapters/azure-openai',
            ]},
            {type: 'category', label: 'Developer Tools', link: {type: 'doc', id: 'adapters/catalogs/devtools'}, items: [
              'adapters/data-simulator',
            ]},
          ],
        },
      ],
    },
    {
      type: 'category', label: 'AI Assistant', link: {type: 'doc', id: 'ai-assistant/index'},
      items: [
        {type: 'category', label: 'Setup', link: {type: 'doc', id: 'ai-assistant/setup/index'}, items: [
          'ai-assistant/setup/license-and-enable',
          'ai-assistant/setup/roles-and-permissions',
          {type: 'category', label: 'Model Providers', link: {type: 'doc', id: 'ai-assistant/setup/providers/index'}, items: [
            'ai-assistant/setup/providers/aws-bedrock',
            'ai-assistant/setup/providers/azure-openai',
            'ai-assistant/setup/providers/azure-ai-foundry',
            'ai-assistant/setup/providers/openai',
            'ai-assistant/setup/providers/xai-grok',
            'ai-assistant/setup/providers/minimax',
            'ai-assistant/setup/providers/ollama',
            'ai-assistant/setup/providers/openai-compatible',
          ]},
          'ai-assistant/setup/policy-and-limits',
          'ai-assistant/setup/organization-skills',
        ]},
        {type: 'category', label: 'Using the Assistant', link: {type: 'doc', id: 'ai-assistant/using-the-assistant/index'}, items: [
          'ai-assistant/using-the-assistant/modes-and-scope',
          'ai-assistant/using-the-assistant/choosing-a-model',
          'ai-assistant/using-the-assistant/attachments-and-context',
          'ai-assistant/using-the-assistant/approvals',
          'ai-assistant/using-the-assistant/conversations',
          'ai-assistant/using-the-assistant/prompt-library',
        ]},
        {type: 'category', label: 'Project AI Knowledge', link: {type: 'doc', id: 'ai-assistant/project-knowledge/index'}, items: [
          'ai-assistant/project-knowledge/documents',
          'ai-assistant/project-knowledge/project-skills',
        ]},
        'ai-assistant/troubleshooting',
      ],
    },
    {
      type: 'category', label: 'Catalogs', link: {type: 'doc', id: 'catalogs/index'},
      items: [
        'catalogs/subscribing',
        'catalogs/using-catalog-content',
        'catalogs/publishing',
        'catalogs/offline-delivery',
      ],
    },
    {
      type: 'category', label: 'High Availability', link: {type: 'doc', id: 'high-availability/index'},
      items: [
        'high-availability/terminology',
        'high-availability/licensing',
        'high-availability/architecture',
        'high-availability/system-requirements',
        'high-availability/topologies',
        'high-availability/backup-and-disaster-recovery',
        'high-availability/planning-your-deployment',
        'high-availability/ha-settings',
        'high-availability/operations',
      ],
    },
    {
      type: 'category', label: 'API', link: {type: 'doc', id: 'api/index'},
      items: [
        {
          type: 'category', label: 'Linkiir Scripting API', link: {type: 'doc', id: 'api/scripting-api/index'},
          items: [
            'api/scripting-api/script-globals',
            'api/scripting-api/message-data',
            'api/scripting-api/message-flow',
            'api/scripting-api/connectivity',
            'api/scripting-api/database',
            'api/scripting-api/byte-transforms',
            'api/scripting-api/json',
            'api/scripting-api/security',
            'api/scripting-api/runtime-system',
            'api/scripting-api/logging',
            'api/scripting-api/node-configuration',
            'api/scripting-api/lua-table-library',
            'api/scripting-api/lua-math-library',
            'api/scripting-api/lua-os-library',
            'api/scripting-api/lua-io-library',
            'api/scripting-api/lua-string-library',
            'api/scripting-api/lua-debug-library',
          ],
        },
        {
          type: 'category', label: 'Web API', link: {type: 'doc', id: 'api/web-api/linkiir-api'},
          // The generated array's own first item duplicates this category's `link`
          // (both point at the intro doc) — drop it, or Next/Prev pagination loops
          // the intro page back to itself.
          items: require('./docs/api/web-api/sidebar.ts').slice(1),
        },
      ],
    },
    {
      type: 'category', label: 'FAQ', link: {type: 'doc', id: 'faq/index'},
      items: ['faq/common-questions', 'faq/tips-best-practices'],
    },
    {
      type: 'category', label: 'Support', link: {type: 'doc', id: 'support/index'},
      items: [
        'support/standard-support',
        'support/urgent-production-support',
        'support/submitting-a-request',
        'support/phi-policy',
      ],
    },
    {
      // Two independent streams: Grid ships as an installable release, catalog
      // content ships over git. Nothing unreleased is published here.
      type: 'category', label: 'Release Notes', link: {type: 'doc', id: 'release-notes/index'},
      items: [
        {
          type: 'category', label: 'Linkiir Product Release Notes',
          link: {type: 'doc', id: 'release-notes/product'},
          items: [
            'release-notes/linkiir-grid-v1.0.0',
          ],
        },
        {
          // Catalog release notes are organised by catalog and then by item, not
          // by release date. A customer arrives knowing which adapter they run
          // and which version they are on; what they need is the current version
          // and what changed. A dated list answers neither and does not scale as
          // adapters accumulate.
          type: 'category', label: 'Linkiir Catalogs Release Notes',
          link: {type: 'doc', id: 'release-notes/catalogs'},
          items: [
            'release-notes/catalogs-fhir',
            'release-notes/catalogs-ehr',
            'release-notes/catalogs-diagnostics',
            'release-notes/catalogs-business',
            'release-notes/catalogs-transport',
            'release-notes/catalogs-notification',
            'release-notes/catalogs-ai',
            'release-notes/catalogs-devtools',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
