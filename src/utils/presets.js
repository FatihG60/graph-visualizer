export const PRESETS = [
  {
    id: 'microservices',
    title: '🌐 Mikroservis Mimarisi',
    description: 'API Gateway, Auth, Veritabanları, Cache ve Mesaj Kuyruğu ilişkileri',
    data: {
      nodes: [
        {
          id: 'gateway',
          label: 'API Gateway',
          subtitle: 'Port 8080 - Nginx',
          icon: 'globe',
          bgColor: '#3b82f6',
          status: 'active',
          type: 'Gateway',
          details: { port: 8080, language: 'Go', uptime: '99.99%', version: 'v2.4.1' }
        },
        {
          id: 'auth_service',
          label: 'Auth Service',
          subtitle: 'OAuth2 / JWT Provider',
          icon: 'shield',
          bgColor: '#8b5cf6',
          status: 'active',
          type: 'Microservice',
          details: { port: 5001, framework: 'Node.js', tokensIssued: 142050, version: 'v1.8.0' }
        },
        {
          id: 'auth_db',
          label: 'Auth Postgres DB',
          subtitle: 'Kullanıcı Kimlik Verileri',
          icon: 'database',
          bgColor: '#06b6d4',
          status: 'active',
          type: 'Database',
          details: { storage: '120GB', maxConnections: 500, region: 'eu-central-1' }
        },
        {
          id: 'user_service',
          label: 'User Service',
          subtitle: 'Kullanıcı Profilleri & Tercihler',
          icon: 'user',
          bgColor: '#ec4899',
          status: 'active',
          type: 'Microservice',
          details: { port: 5002, framework: 'Python FastAPI', rps: 850 }
        },
        {
          id: 'redis_cache',
          label: 'Redis Cache',
          subtitle: 'Oturum & İn-Memory Önbellek',
          icon: 'storage',
          bgColor: '#ef4444',
          status: 'active',
          type: 'Cache',
          details: { memoryUsed: '3.4GB', hitRate: '94.2%', nodeType: 'Cluster' }
        },
        {
          id: 'order_service',
          label: 'Order Service',
          subtitle: 'Sipariş İşleme Servisi',
          icon: 'cpu',
          bgColor: '#10b981',
          status: 'active',
          type: 'Microservice',
          details: { port: 5003, framework: 'Java Spring Boot', queueDepth: 12 }
        },
        {
          id: 'rabbitmq',
          label: 'RabbitMQ Event Broker',
          subtitle: 'Sipariş & Bildirim Kuyruğu',
          icon: 'radio',
          bgColor: '#f59e0b',
          status: 'warning',
          type: 'Message Queue',
          details: { unackedMessages: 45, memoryUsage: '1.2GB', version: 'v3.12' }
        },
        {
          id: 'payment_api',
          label: 'Stripe Payment API',
          subtitle: 'Harici Ödeme Entegrasyonu',
          icon: 'key',
          bgColor: '#6366f1',
          status: 'active',
          type: 'External API',
          details: { provider: 'Stripe', timeoutMs: 3000, sandboxMode: false }
        },
        {
          id: 'notification_worker',
          label: 'Notification Worker',
          subtitle: 'E-posta & Push Gönderici',
          icon: 'mail',
          bgColor: '#14b8a6',
          status: 'active',
          type: 'Worker',
          details: { sentToday: 5430, failed: 2, workerThreads: 8 }
        }
      ],
      edges: [
        { id: 'e1', source: 'gateway', target: 'auth_service', label: '/api/v1/auth' },
        { id: 'e2', source: 'gateway', target: 'user_service', label: '/api/v1/users' },
        { id: 'e3', source: 'gateway', target: 'order_service', label: '/api/v1/orders' },
        { id: 'e4', source: 'auth_service', target: 'auth_db', label: 'SQL Reads/Writes' },
        { id: 'e5', source: 'auth_service', target: 'redis_cache', label: 'Session Cache' },
        { id: 'e6', source: 'user_service', target: 'redis_cache', label: 'Profile Cache' },
        { id: 'e7', source: 'order_service', target: 'payment_api', label: 'HTTPS API' },
        { id: 'e8', source: 'order_service', target: 'rabbitmq', label: 'Publish OrderCreated' },
        { id: 'e9', source: 'rabbitmq', target: 'notification_worker', label: 'Consume Message' }
      ]
    }
  },
  {
    id: 'org_chart',
    title: '🏢 Şirket Organizasyon Şeması',
    description: 'Yönetim, Mühendislik, Tasarım ve Ürün ekipleri hiyerarşisi',
    data: {
      nodes: [
        {
          id: 'ceo',
          label: 'Ahmet Yılmaz',
          subtitle: 'CEO & Kurucu',
          icon: 'users',
          bgColor: '#8b5cf6',
          status: 'active',
          type: 'Executive',
          details: { department: 'Management', email: 'ahmet@company.com', experience: '15 Years' }
        },
        {
          id: 'cto',
          label: 'Elif Kaya',
          subtitle: 'CTO / Teknoloji Lideri',
          icon: 'cpu',
          bgColor: '#3b82f6',
          status: 'active',
          type: 'Management',
          details: { department: 'Engineering', teamSize: 35, location: 'İstanbul' }
        },
        {
          id: 'cpo',
          label: 'Mehmet Demir',
          subtitle: 'CPO / Ürün Direktörü',
          icon: 'layers',
          bgColor: '#ec4899',
          status: 'active',
          type: 'Management',
          details: { department: 'Product', teamSize: 12, location: 'Ankara' }
        },
        {
          id: 'lead_fe',
          label: 'Can Özkan',
          subtitle: 'Frontend Lead Engineer',
          icon: 'code',
          bgColor: '#06b6d4',
          status: 'active',
          type: 'Lead',
          details: { techStack: ['React', 'TypeScript', 'Tailwind'], experience: '8 Years' }
        },
        {
          id: 'lead_be',
          label: 'Selin Aksoy',
          subtitle: 'Backend Lead Architect',
          icon: 'server',
          bgColor: '#10b981',
          status: 'active',
          type: 'Lead',
          details: { techStack: ['Go', 'PostgreSQL', 'Kafka'], experience: '9 Years' }
        },
        {
          id: 'lead_devops',
          label: 'Burak Şahin',
          subtitle: 'DevOps & SRE Lead',
          icon: 'box',
          bgColor: '#f59e0b',
          status: 'active',
          type: 'Lead',
          details: { tools: ['Kubernetes', 'Terraform', 'AWS'], clusters: 8 }
        },
        {
          id: 'ux_lead',
          label: 'Deniz Arslan',
          subtitle: 'Lead UI/UX Designer',
          icon: 'workflow',
          bgColor: '#f43f5e',
          status: 'active',
          type: 'Design',
          details: { tools: ['Figma', 'Prototyping', 'User Research'] }
        }
      ],
      edges: [
        { id: 'e_org1', source: 'ceo', target: 'cto', label: 'Yönetim' },
        { id: 'e_org2', source: 'ceo', target: 'cpo', label: 'Yönetim' },
        { id: 'e_org3', source: 'cto', target: 'lead_fe', label: 'Frontend Takımı' },
        { id: 'e_org4', source: 'cto', target: 'lead_be', label: 'Backend Takımı' },
        { id: 'e_org5', source: 'cto', target: 'lead_devops', label: 'Altyapı Takımı' },
        { id: 'e_org6', source: 'cpo', target: 'ux_lead', label: 'Tasarım Ekibi' }
      ]
    }
  },
  {
    id: 'data_lineage',
    title: '📊 Veri Hattı & ETL Lineage',
    description: 'Ham veriden analitik panolara veri akışı',
    data: {
      nodes: [
        {
          id: 'raw_db',
          label: 'OLTP Postgres DB',
          subtitle: 'Ham İşlem Verileri',
          icon: 'database',
          bgColor: '#0284c7',
          status: 'active',
          type: 'Source',
          details: { records: '45,200,000', updateFreq: 'Real-time' }
        },
        {
          id: 'kafka_stream',
          label: 'Kafka Ingestion',
          subtitle: 'CDC Event Stream',
          icon: 'radio',
          bgColor: '#d97706',
          status: 'active',
          type: 'Stream',
          details: { throughput: '12.5 MB/s', topic: 'db.events.v1' }
        },
        {
          id: 'spark_etl',
          label: 'Apache Spark Cluster',
          subtitle: 'Veri Temizleme & Aggregation',
          icon: 'terminal',
          bgColor: '#e11d48',
          status: 'active',
          type: 'Processing',
          details: { nodesCount: 16, memory: '128GB RAM', batchTime: '5 min' }
        },
        {
          id: 'snowflake_dw',
          label: 'Snowflake DW',
          subtitle: 'Analytics Data Warehouse',
          icon: 'cloud',
          bgColor: '#06b6d4',
          status: 'active',
          type: 'Warehouse',
          details: { schema: 'analytics_prod', tablesCount: 142 }
        },
        {
          id: 'metabase',
          label: 'Metabase BI Dashboard',
          subtitle: 'Yönetici Raporları & Grafikler',
          icon: 'activity',
          bgColor: '#10b981',
          status: 'active',
          type: 'BI Tool',
          details: { dashboardsCount: 28, activeUsers: 140 }
        }
      ],
      edges: [
        { id: 'el1', source: 'raw_db', target: 'kafka_stream', label: 'CDC Replication' },
        { id: 'el2', source: 'kafka_stream', target: 'spark_etl', label: 'Stream Consumer' },
        { id: 'el3', source: 'spark_etl', target: 'snowflake_dw', label: 'Parquet Loader' },
        { id: 'el4', source: 'snowflake_dw', target: 'metabase', label: 'SQL Query' }
      ]
    }
  },
  {
    id: 'nested_json',
    title: '🌳 İç İçe Geçmiş JSON Nesnesi',
    description: 'JSON ağaç yapısının otomatik grafa dönüştürülmesi örneği',
    data: {
      projeAdi: 'Antigravity Graph App',
      versiyon: '1.0.0',
      sunucular: [
        { isim: 'Sunucu-Alpha', IP: '192.168.1.10', durum: 'Aktif', rol: 'Master' },
        { isim: 'Sunucu-Beta', IP: '192.168.1.11', durum: 'Aktif', rol: 'Worker' }
      ],
      veritabani: {
        tur: 'PostgreSQL',
        port: 5432,
        tablolar: ['kullanicilar', 'siparisler', 'loglar']
      }
    }
  }
];
