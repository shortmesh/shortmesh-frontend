// assets
import {
  DashboardOutlined,
  CommentOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  ApiOutlined,
  CreditCardOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  ApiOutlined,
  CreditCardOutlined,
  SettingOutlined,
  CommentOutlined
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
    // {
    //   id: 'posts',
    //   title: 'Posts',
    //   type: 'item',
    //   url: '/posts',
    //   icon: icons.CommentOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'platforms',
      title: 'Platforms',
      type: 'item',
      url: '/platforms',
      icon: icons.UsergroupAddOutlined,
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
      id: 'api-keys',
      title: 'API Keys',
      type: 'item',
      url: '/api-keys',
      icon: icons.ApiOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'subscription',
    //   title: 'Subscription & Billing',
    //   type: 'item',
    //   url: '/subscription',
    //   icon: icons.CreditCardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
