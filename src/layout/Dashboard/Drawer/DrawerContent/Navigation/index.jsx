import { useState, useEffect } from 'react';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// icons
import { SafetyOutlined, AppstoreOutlined } from '@ant-design/icons';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { getServices } from 'api/services';

// ── Static registry: maps API service name → nav item config ─────────────────
// Add an entry here whenever a new service page is added to the dashboard.
const SERVICE_REGISTRY = {
  authy: {
    id: 'authy',
    title: 'Authy',
    type: 'item',
    url: '/authy',
    icon: SafetyOutlined,
    breadcrumbs: false
  }
};

const FALLBACK_ICON = AppstoreOutlined;

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const [dynamicServices, setDynamicServices] = useState(null); // null = not yet fetched

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    getServices()
      .then((services) => {
        const children = services
          .map((svc) => {
            const registered = SERVICE_REGISTRY[svc.name];
            if (registered) return registered;
            // Unregistered service — show a generic placeholder
            return {
              id: svc.name,
              title: svc.display_name || svc.name,
              type: 'item',
              url: `/${svc.name}`,
              icon: FALLBACK_ICON,
              breadcrumbs: false
            };
          })
          .filter(Boolean);
        setDynamicServices(children);
      })
      .catch(() => {
        // Silently fall back to static list on error
        setDynamicServices(null);
      });
  }, []);

  // Build the final item list, replacing the services group children when fetched
  const resolvedItems = menuItem.items.map((item) => {
    if (item.id === 'services' && dynamicServices !== null) {
      return { ...item, children: dynamicServices };
    }
    return item;
  });

  const navGroups = resolvedItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
