// assets
import { DashboardOutlined, ApiOutlined, AppstoreOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ApiOutlined,
  AppstoreOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'platforms',
      title: 'Platforms',
      type: 'item',
      url: '/platforms',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'analytics',
    //   title: 'Analytics',
    //   type: 'item',
    //   url: '/analytics',
    //   icon: icons.RiseOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'tokens',
      title: 'Tokens',
      type: 'item',
      url: '/api-keys',
      icon: icons.ApiOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
