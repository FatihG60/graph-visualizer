import React from 'react';
import {
  Database,
  Server,
  User,
  Cloud,
  Cpu,
  Globe,
  Shield,
  Code,
  FileText,
  Smartphone,
  Zap,
  Settings,
  Lock,
  Mail,
  HardDrive,
  Layers,
  Activity,
  Box,
  Terminal,
  Share2,
  Folder,
  Key,
  Users,
  Radio,
  Workflow
} from 'lucide-react';

export const ICON_LIST = [
  { id: 'database', label: 'Veritabanı', icon: Database },
  { id: 'server', label: 'Sunucu', icon: Server },
  { id: 'user', label: 'Kullanıcı', icon: User },
  { id: 'users', label: 'Kullanıcılar', icon: Users },
  { id: 'cloud', label: 'Bulut Servisi', icon: Cloud },
  { id: 'cpu', label: 'İşlemci / Microservice', icon: Cpu },
  { id: 'globe', label: 'Web / API Endpoint', icon: Globe },
  { id: 'shield', label: 'Güvenlik / Auth', icon: Shield },
  { id: 'code', label: 'Kod / Script', icon: Code },
  { id: 'file', label: 'Dosya / Doküman', icon: FileText },
  { id: 'phone', label: 'Mobil Uygulama', icon: Smartphone },
  { id: 'zap', label: 'Event / Trigger', icon: Zap },
  { id: 'settings', label: 'Yapılandırma', icon: Settings },
  { id: 'lock', label: 'Şifreleme', icon: Lock },
  { id: 'mail', label: 'E-posta Servisi', icon: Mail },
  { id: 'storage', label: 'Depolama', icon: HardDrive },
  { id: 'layers', label: 'Katman / Modül', icon: Layers },
  { id: 'activity', label: 'İzleme / Telemetri', icon: Activity },
  { id: 'box', label: 'Container / Docker', icon: Box },
  { id: 'terminal', label: 'CLI / Worker', icon: Terminal },
  { id: 'network', label: 'Ağ / Proxy', icon: Share2 },
  { id: 'folder', label: 'Dizin', icon: Folder },
  { id: 'key', label: 'Anahtar / Token', icon: Key },
  { id: 'radio', label: 'Kuyruk / MQ', icon: Radio },
  { id: 'workflow', label: 'Workflow', icon: Workflow },
];

export const getIconComponent = (iconId, props = {}) => {
  const item = ICON_LIST.find((i) => i.id === iconId?.toLowerCase());
  const Component = item ? item.icon : Box;
  return React.createElement(Component, props);
};
