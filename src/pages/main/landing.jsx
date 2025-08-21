import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  TextField,
  CardMedia,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { motion } from 'framer-motion';
import {
  ApiOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DashOutlined,
  DownloadOutlined,
  EyeOutlined,
  GithubOutlined,
  LineChartOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
  RobotOutlined,
  SecurityScanOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import BannerImage from '../../components/BannerImage';
import AnimateButton from 'components/@extended/AnimateButton';
import APIFlow from './APIFlow';
import ChatBubbles from './ChatBubbles';
import { Link } from 'react-router';
import Nav from '../../components/nav';

const codeSnippets = {
  js: `const res = await fetch("https://api.shortmesh.com/wa/message/2376543210", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: "janedoe",
    message: "hello world",
    device_name: "01234567898"
  })
});`,

  python: `import requests

response = requests.post(
  "https://api.shortmesh.com/signal/message/2376543210",
  headers={
    "Authorization": "Bearer sk_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  json={
    "username": "janedoe",
    "message": "hello world",
    "device_name": "01234567898"
  }
)
print(response.json())`,

  curl: `curl -X POST https://api.shortmesh.com/wa/message/2376543210 \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "username": "janedoe", "message": "hello world", "device_name": "01234567898" }'`,

  c: `#include <curl/curl.h>

int main() {
  CURL *curl = curl_easy_init();
  if (curl) {
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Authorization: Bearer sk_live_YOUR_API_KEY");
    headers = curl_slist_append(headers, "Content-Type: application/json");

    const char *json = "{\\"username\\": \\"janedoe\\", \\"message\\": \\"hello world\\", \\"device_name\\": \\"01234567898\\"}";

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.shortmesh.com/signal/message/2376543210");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json);
    curl_easy_perform(curl);
    curl_easy_cleanup(curl);
  }
  return 0;
}`,

  'c++': `#include <curl/curl.h>

int main() {
  CURL *curl = curl_easy_init();
  if (curl) {
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Authorization: Bearer sk_live_YOUR_API_KEY");
    headers = curl_slist_append(headers, "Content-Type: application/json");

    const char *json = R"({"username": "janedoe", "message": "hello world", "device_name": "01234567898"})";

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.shortmesh.com/wa/message/2376543210");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json);
    curl_easy_perform(curl);
    curl_easy_cleanup(curl);
  }
  return 0;
}`
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Landing = () => {
  const [userTab, setUserTab] = useState('developers');
  const [codeTab, setCodeTab] = useState('js');

  const handleUserTabChange = (event, newValue) => {
    setUserTab(newValue);
  };

  const handleCodeTabChange = (event, newValue) => {
    setCodeTab(newValue);
  };

  const FeatureCard = ({ title, description, icon }) => (
    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            bgcolor: '#ffffff',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 2
            },
            px: 2,
            py: 4,
            minHeight: 210
          }}
        >
          <CardContent>
            <Typography className="header" variant="h6" gutterBottom>
              {icon} {title}
            </Typography>
            <Typography variant="body2" sx={{ pt: 2 }}>
              {description}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );

  const Footer = () => (
    <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center', bottom: 0 }}>
      <Divider />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        &copy; {new Date().getFullYear()} Afkanerd. All rights reserved.
      </Typography>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          overflow: 'auto',
          bgcolor: '#EFEFEF'
        }}
      >
        <Nav />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: { xs: 8, md: 14 } }}>
          <Box
            sx={{
              position: 'absolute',
              top: { md: -20, xs: -0 },
              left: { md: -0, xs: -50 },
              width: { md: 800, xs: 80 },
              height: { md: 400, xs: 80 },
              background: 'radial-gradient(circle, rgba(202, 215, 248, 0.63) 0%, transparent 70%)',
              filter: 'blur(100px)',
              zIndex: 0
            }}
          />
          <Box
            sx={{
              pt: { xs: 13, sm: 15, md: 2, xl: 10 },
              my: 'auto',
              alignContent: 'center',
              textAlign: 'center',
              px: { xs: 2, sm: 6, md: 10, lg: 35, xl: 55 },
              zIndex: 1
            }}
            wrap
          >
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Chip color="primary" variant="outlined" label="ShortMesh" sx={{ borderRadius: 7, bgcolor: '#fff', mb: 3 }} />
              <Chip color="success" variant="outlined" label="Open-Source" sx={{ borderRadius: 7, bgcolor: '#fff', mb: 3, ml: 1 }} />
              <Typography
                variant="h1"
                sx={{
                  background: 'linear-gradient(90deg,rgb(123, 30, 146),rgb(7, 12, 36),hsl(216, 81.10%, 33.10%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  mixBlendMode: 'hard-light',
                  letterSpacing: 0,
                  color: 'black'
                }}
                className="header"
              >
                Messaging bridge API that lets you send and recieve messages across different platforms.{' '}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  py: { md: 6, xs: 4 },
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
                }}
                wrap
              >
                Our API lets you access and manage messages from major social <br />
                media platforms through a single, developer-friendly API.
              </Typography>
              <Grid container justifyContent="center" spacing={1} sx={{ mt: 3 }}>
                {' '}
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    pr: { xs: 0.5, sm: 1 }
                  }}
                >
                  <a
                    href="mailto:developers@smswithoutborders.com?subject=Request%20Demo&body=Hi%20ShortMesh%20Team,%0A%0AI'd%20like%20to%20request%20a%20demo%20of%20your%20platform.%0A%0AThanks!"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      size="large"
                      sx={{
                        borderRadius: 7,
                        textTransform: 'none',
                        px: { xs: 2, sm: 4, md: 6 },
                        py: { xs: 1, sm: 1.5, md: 1.5 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                      }}
                      variant="contained"
                    >
                      Request Demo
                    </Button>
                  </a>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    pl: { xs: 0.5, sm: 1 },
                    mt: 2
                  }}
                >
                  <a href="https://api.shortmesh.com/tutorials" target="_blank" style={{ textDecoration: 'none' }}>
                    <Typography
                      endIcon={<ArrowRightOutlined />}
                      variant="body1"
                      sx={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                      }}
                    >
                      Get Started Quickly
                    </Typography>
                  </a>
                  <Divider
                    sx={{
                      width: '100%',
                      borderBottomWidth: '2px',
                      borderColor: '#000000',
                      mt: 0.5
                    }}
                  />
                </Grid>
              </Grid>
            </motion.div>
          </Box>

          {/* Image section */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
              //my: { xs: 4, md: 3 },
            }}
          >
            <BannerImage />
          </Box>
        </Box>

        {/*  */}

        <Box id="features">
          <Box sx={{ px: { md: 15, sm: 10, lg: 20, xs: 2 }, bgcolor: '#ffffff', py: { xs: 4, md: 0 } }}>
            <Grid container alignItems="stretch" justifyContent="center" alignContent="center">
              {[
                {
                  icon: <ApiOutlined style={{ fontSize: 30, color: '#000' }} />,
                  title: 'API Access',
                  description: 'Get secure API keys instantly and start integrating social inboxes with minimal setup.'
                },
                {
                  icon: <MessageOutlined style={{ fontSize: 30, color: '#000' }} />,
                  title: 'Messaging Support',
                  description: 'Send messages using our API, recieve messages in real-time by setting up a webhook'
                },
                {
                  icon: <DashboardOutlined style={{ fontSize: 30, color: '#000' }} />,
                  title: 'Insightful dashboard',
                  description: 'Our dashboard lets you manage your accounts, add devices and access your API keys all in one place.'
                },
                {
                  icon: <UsergroupAddOutlined style={{ fontSize: 30, color: '#000' }} />,
                  title: 'Multi-Platform Support',
                  description: 'We currently support more than one platform, and we are actively working to add more platforms.'
                }
              ].map((item, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 3 }}
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    py: { md: 10, xs: 4 },
                    px: 3,
                    height: '100%',
                    borderRight: { md: index !== 3 ? '1px solid rgb(178, 183, 190)' : 'none', xs: 'none' }
                  }}
                >
                  {item.icon}
                  <Typography variant="h5" sx={{ mt: 2, color: '#000000', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' } }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: 'grey', fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' } }}>
                    {item.description}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/*  */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Box
            sx={{
              py: { xs: 6, md: 1 },
              px: { xs: 2, md: 8, sm: 8, lg: 8, xl: 10 },
              mx: { xs: 2, md: 20, sm: 20, lg: 20, xl: 30 },
              my: { xs: 4, md: 10 },
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: '#fff',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Grid container alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 3
                    }}
                  >
                    Why use ShortMesh?
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' }
                    }}
                  >
                    ShortMesh gives you direct access to your communication platforms using your existing phone accounts - no template
                    restrictions, no per-message fees.
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      '& li': { mb: 2, color: '#ebebebff', display: 'flex', alignItems: 'center', gap: 1 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                      mb: 4
                    }}
                  >
                    <li>
                      <PhoneOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} /> Link your existing phone account
                    </li>
                    <li>
                      <ClockCircleOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} /> Get API access in under 10 minutes
                    </li>
                    <li>
                      <MessageOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} /> Message any of your contacts immediately
                    </li>
                  </Box>{' '}
                  <a href="https://api.shortmesh.com/tutorials" target="_blank" style={{ textDecoration: 'none' }}>
                    <Button
                      size="large"
                      endIcon={<ArrowRightOutlined style={{ transform: 'rotate(-45deg)' }} />}
                      sx={{
                        borderRadius: 7,
                        color: '#000',
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#31134C',
                          color: '#fff'
                        },
                        textTransform: 'none',
                        px: { xs: 2, sm: 4, md: 6 }
                      }}
                      variant="contained"
                    >
                      Get Started Quickly
                    </Button>
                  </a>
                </Box>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 5
                }}
              >
                <APIFlow />
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/*  */}
        <Box
          id="self-host"
          sx={{
            textAlign: 'center',
            py: 13,
            px: { xs: 2, md: 15, sm: 10, lg: 25 },
            zIndex: 1,
            position: 'relative',
            bgcolor: '#ffffff'
          }}
        >
          {/* <Typography sx={{ wordSpacing: 20 }} className="header" variant="h3">
            Connect. Automate. Scale.
          </Typography> */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Open Source & Self-Hostable
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
              Complete control over your data. Host your own instance or use our managed service. We won't touch any of your data.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component="a"
                href="https://github.com/shortmesh"
                target="_blank"
                variant="outlined"
                startIcon={<GithubOutlined />}
                sx={{ borderRadius: 7, textTransform: 'none' }}
              >
                View on GitHub
              </Button>
              <Button component="a" href="/dashboard" variant="contained" sx={{ borderRadius: 7, textTransform: 'none' }}>
                Try Hosted Version
              </Button>
            </Box>
          </Box>
        </Box>

        {/*  */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Divider sx={{ color: '#2F52E0', height: '4px' }} />
          <Box
            sx={{
              py: { xs: 6, md: 1 },
              px: { xs: 2, md: 8, sm: 8, lg: 8, xl: 10 },
              mx: { xs: 2, md: 20, sm: 20, lg: 20, xl: 30 },
              my: { xs: 4, md: 10 },
              borderRadius: 2,
              bgcolor: '#31134C',
              color: '#fff',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Grid container alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: { md: 8, xs: 4 }
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    What You Can Do With ShortMesh
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' }
                    }}
                  >
                    Build smarter, manage easier, our API puts control in your hands.
                  </Typography>

                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      '& li': { mb: 2, color: '#fdfdfd', display: 'flex', alignItems: 'center', gap: 1 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' }
                    }}
                  >
                    <li>
                      <RobotOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} />
                      Build Multi-Platform Chatbots
                    </li>
                    <li>
                      <UsergroupAddOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} />
                      Centralize Customer Communication
                    </li>
                    <li>
                      <ThunderboltOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} />
                      Automate Workflows & Notifications
                    </li>
                    <li>
                      <LineChartOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} />
                      Track and Analyze Interactions
                    </li>
                    <li>
                      <SecurityScanOutlined style={{ color: '#ebebebff', fontSize: '1.2rem' }} />
                      Test Bots in Real Conditions
                    </li>
                  </Box>

                  <a href="https://api.shortmesh.com/tutorials" target="_blank" style={{ textDecoration: 'none', marginTop: '2rem' }}>
                    <Button
                      size="large"
                      variant="contained"
                      endIcon={<ArrowRightOutlined style={{ transform: 'rotate(-45deg)' }} />}
                      sx={{
                        borderRadius: 7,
                        color: '#000',
                        backgroundColor: '#fff',
                        textTransform: 'none',
                        px: { xs: 2, sm: 4, md: 6 },
                        mt: 2,
                        '&:hover': {
                          backgroundColor: '#3F51B5',
                          color: '#fff'
                        }
                      }}
                    >
                      Documentation
                    </Button>
                  </a>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <ChatBubbles />
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Pricing Section */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Box
            id="pricing"
            sx={{
              py: { xs: 8, md: 12 },
              px: { xs: 2, md: 15 },
              bgcolor: '#f8f9fa',
              textAlign: 'center'
            }}
          >
            <Typography className="header" variant="h2" sx={{ mb: 2 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" sx={{ mb: 8, color: 'text.secondary' }}>
              Everything you need to build powerful messaging integrations, No pay-per-message fees. No hidden costs.
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {/* Self-Hosted Option */}
              <Grid size={{ xs: 12, md: 4.5, xl: 3.5 }}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: '2px solid #e5e7eb',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Self-Hosted
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#16a34a', display: 'inline' }}>
                        Free
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', display: 'inline' }}>
                        {' '}
                        /forever
                      </Typography>
                    </Box>

                    <List sx={{ mb: 4, textAlign: 'left' }}>
                      {[
                        'Complete data control',
                        'Host on your infrastructure',
                        'Full source code access',
                        'No data sharing with us',
                        'Community support',
                        'All features included'
                      ].map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                ✓ {feature}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                      <ListItem sx={{ py: 0.5, px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontSize: '1rem', color: '#d32f2f' }}>
                              ✗ No dashboard access
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>

                    <Button
                      component="a"
                      href="https://github.com/shortmesh"
                      target="_blank"
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<GithubOutlined />}
                      sx={{
                        borderRadius: 7,
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Hosted Option */}
              <Grid size={{ xs: 12, md: 4.5, xl: 3.5 }}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: '#ffffff',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    position: 'relative',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Chip
                    label="Recommended"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold'
                    }}
                  />

                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Hosted
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'inline' }}>
                        $20
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', display: 'inline' }}>
                        /month
                      </Typography>
                    </Box>

                    <List sx={{ mb: 4, textAlign: 'left' }}>
                      {[
                        'Unlimited WhatsApp messages',
                        'Unlimited Signal messages',
                        'Dashboard access',
                        'Cross-platform communication',
                        'Unlimited webhook callbacks',
                        'Priority support',
                        '99.9% uptime'
                      ].map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                ✓ {feature}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      component="a"
                      href="/dashboard"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        borderRadius: 7,
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* More Section */}
        <Box sx={{ my: { xs: 15, md: 10 }, mx: { xs: 2, md: 15, lg: 25 } }}>
          <Box
            sx={{
              // position: 'absolute',
              top: '-1000%',
              left: '-10%',
              width: '200%',
              height: '150%',
              background: 'radial-gradient(circle, rgba(66, 103, 182, 0.8), transparent 60%)',
              zIndex: 2
            }}
          />
          <Typography className="header" variant="h2" textAlign="center">
            Built For Everyone
          </Typography>
          <Typography variant="subtitle1" sx={{ pb: 6, pt: 2, color: 'grey' }} textAlign="center">
            No matter the scale of your business, ShortMesh provides the tools to simplify, manage, and optimize your messaging.
          </Typography>

          <TabContext value={userTab}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 6
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#3F51B5',
                  borderRadius: 50,
                  px: { md: 10, xs: 2 },
                  py: 1
                }}
              >
                <TabList onChange={handleUserTabChange} TabIndicatorProps={{ style: { display: 'none' } }} textColor="primary">
                  <Tab
                    label="Developers"
                    value="developers"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 50,
                      px: 4,
                      color: '#fff',
                      '&.Mui-selected': {
                        backgroundColor: '#fff',
                        color: '#000000'
                      }
                    }}
                  />
                  <Tab
                    label="Entrepreneurs"
                    value="business"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 50,
                      px: 4,
                      color: '#fff',
                      '&.Mui-selected': {
                        backgroundColor: '#fff',
                        color: '#000000'
                      }
                    }}
                  />
                </TabList>
              </Box>
            </Box>

            {/* Developers */}
            <TabPanel value="developers">
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography className="header" variant="h5" sx={{ mb: 4 }} gutterBottom>
                    For Developers
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 6 }}>
                    Integrate messages into your stack effortlessly. Build, monitor and manage communications across platforms with ease.
                  </Typography>
                  <a href="https://api.shortmesh.com/tutorials" target="_blank">
                    <Button
                      endIcon={<ArrowRightOutlined style={{ transform: 'rotate(-45deg)' }} />}
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 7,
                        textTransform: 'none',
                        bgcolor: '#000000',
                        color: '#ffffff'
                      }}
                    >
                      Developer Docs
                    </Button>
                  </a>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: '#1e1e1e',
                      color: '#dcdcdc',
                      fontFamily: 'monospace',
                      minHeight: '360px',
                      boxShadow: '0 0 20px rgba(0,255,170,0.1)'
                    }}
                  >
                    <Box sx={{ bgcolor: '#111', color: '#00ff99', px: 2, py: 1, fontWeight: 'bold', fontSize: 12 }}>
                      ● ● ●&nbsp;&nbsp;~@shortmesh: sending message...
                    </Box>

                    <TabContext value={codeTab}>
                      <TabList
                        onChange={handleCodeTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{ backgroundColor: '#2a2a2a', px: 2 }}
                      >
                        {Object.keys(codeSnippets).map((lang) => (
                          <Tab
                            key={lang}
                            label={lang.toUpperCase()}
                            value={lang}
                            sx={{
                              textTransform: 'none',
                              color: '#aaa',
                              '&.Mui-selected': {
                                color: '#00ffcc',
                                borderBottom: '2px solid #00ffcc'
                              }
                            }}
                          />
                        ))}
                      </TabList>

                      <TabPanel value={codeTab} sx={{ p: 2, pt: 1 }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          <code>{codeSnippets[codeTab]}</code>
                        </pre>
                      </TabPanel>
                    </TabContext>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Entrepreneurs */}
            <TabPanel value="business">
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography className="header" variant="h5" sx={{ mb: 4 }} gutterBottom>
                    For Entrepreneurs
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 6 }}>
                    Send messages, view messages and manage your devices from our robust dashboard. Never miss a customer regardless of the
                    platform. .{' '}
                  </Typography>
                  <a href="mailto:developers@smswithoutborders.com?subject=Request%20Demo&body=Hi%20ShortMesh%20Team,%0A%0AI'd%20like%20to%20request%20a%20demo%20of%20your%20platform.%0A%0AThanks!">
                    <Button
                      endIcon={<ArrowRightOutlined style={{ transform: 'rotate(-45deg)' }} />}
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 7,
                        textTransform: 'none',
                        bgcolor: '#000000',
                        color: '#ffffff'
                      }}
                    >
                      Request Demo
                    </Button>
                  </a>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  {/* Main Dashboard Image */}
                  <Box
                    component="img"
                    src="dash.png"
                    alt="Dashboard preview"
                    sx={{
                      width: { md: '75%', xs: '90%' },
                      borderColor: 'grey.300',
                      border: 6,
                      borderRadius: 2,
                      zIndex: 2
                    }}
                  />

                  {/* Top-left Floating Box */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 60,
                      left: 20,
                      bgcolor: '#ffffff',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 3,
                      border: '1px solid #ccc',
                      fontSize: 12,
                      fontWeight: 500,
                      zIndex: 2
                    }}
                  >
                    <PlusOutlined /> Send Message
                  </Box>

                  {/* Bottom-right Floating Box */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: 30,
                      bgcolor: '#ffffff',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 3,
                      border: '1px solid #ccc',
                      fontSize: 12,
                      fontWeight: 500,
                      zIndex: 2
                    }}
                  >
                    <EyeOutlined /> View Message
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Landing;
