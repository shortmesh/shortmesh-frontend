// assets
import { SafetyOutlined } from '@ant-design/icons';

// icons
const icons = {
  SafetyOutlined
};

// ==============================|| MENU ITEMS - SERVICES ||============================== //

const services = {
  id: 'services',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'authy',
      title: 'Authy',
      type: 'item',
      url: '/authy',
      icon: icons.SafetyOutlined,
      breadcrumbs: false
    }
  ]
};

export default services;
