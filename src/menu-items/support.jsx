// assets
import { QuestionOutlined, GithubOutlined, XOutlined, FileSearchOutlined } from '@ant-design/icons';

// icons
const icons = {
  QuestionOutlined,
  GithubOutlined,
  XOutlined,
  FileSearchOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: '/documentation',
      icon: icons.FileSearchOutlined,
      breadcrumbs: false
    },
    {
      id: 'help',
      title: 'help',
      type: 'item',
      url: '/help',
      icon: icons.QuestionOutlined,
      breadcrumbs: false
    }
  ]
};

export default support;
