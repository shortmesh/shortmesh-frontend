import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Paper, TextField, CardMedia, Avatar, Divider } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { motion } from 'framer-motion';
import {
  ApiOutlined,
  DashboardOutlined,
  DashOutlined,
  GithubOutlined,
  LineChartOutlined,
  MessageOutlined,
  SecurityScanOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import BannerImage from '../../components/BannerImage';
import AnimateButton from 'components/@extended/AnimateButton';

const codeSnippets = {
  js: `const res = await fetch("https://api.shortmesh.io/messages", {
  headers: {
    Authorization: "Bearer sk_live_ABC123XYZ"
  }
});
`,
  curl: `curl -X GET "https://api.shortmesh.io/messages" `
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

  const Nav = () => (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 30, mr: 1 }} />
        <Typography variant="h6" className="header" sx={{ fontWeight: 'bold', fontSize: { xs: 12, md: 20 } }}>
          ShortMesh
        </Typography>
      </Box>

      {/* Buttons + GitHub */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AnimateButton>
          <Button component="a" href="/dashboard" variant="contained" sx={{ textTransform: 'none', borderRadius: 7, px: 4 }}>
            Login
          </Button>
        </AnimateButton>
        <a href="https://github.com/shortmesh" target="_blank">
          {' '}
          <GithubOutlined style={{ fontSize: 27, color: 'black' }} />{' '}
        </a>
      </Box>
    </Box>
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
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Nav />
          <Box
            sx={{
              position: 'absolute',
              top: { md: -20, xs: -0 },
              left: { md: -0, xs: -50 },
              width: { md: 800, xs: 80 },
              height: { md: 400, xs: 80 },
              background: 'radial-gradient(circle, rgba(232, 237, 253, 0.94) 0%, transparent 70%)',
              filter: 'blur(100px)',
              zIndex: 0
            }}
          />
          <Box
            sx={{
              pt: { xs: 13, sm: 15, md: 15 },
              my: 'auto',
              alignContent: 'center',
              textAlign: 'center',
              px: { xs: 2, sm: 2, md: 4 },
              zIndex: 1
            }}
          >
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Typography
                variant="h1"
                sx={{
                  background: 'linear-gradient(90deg,rgb(33, 45, 100),rgb(7, 12, 36),rgb(0, 0, 0))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: { xs: '3.5rem', sm: '5rem', md: '7.5rem' },
                  mixBlendMode: 'hard-light',
                  color: 'black'
                }}
                className="header"
              >
                Coming Soon
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  py: { md: 8, xs: 4 },
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1.5rem' }
                }}
                wrap
              >
                <span style={{ fontWeight: 'bold' }}>ShortMesh</span> lets you access and manage messages from all major social <br />
                media platforms through a single, developer-friendly API.
              </Typography>
              <Grid container justifyContent="center" spacing={1}>
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
                        borderRadius: 1,
                        color: '#ffffff',
                        backgroundColor: '#000000',
                        hover: {
                          backgroundColor: '#3F51B5'
                        },
                        textTransform: 'none',
                        px: { xs: 2, sm: 4, md: 8 },
                        py: { xs: 1, sm: 1.5, md: 2.2 },
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
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    pl: { xs: 0.5, sm: 1 }
                  }}
                >
                  <a href="https://github.com/shortmesh" target="_blank" style={{ textDecoration: 'none' }}>
                    <Button
                      startIcon={<GithubOutlined />}
                      size="large"
                      sx={{
                        borderRadius: 1,
                        color: '#000000',
                        borderColor: '#000000',
                        textTransform: 'none',
                        px: { xs: 3, sm: 4, md: 8 },
                        py: { xs: 1, sm: 1.5, md: 2 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                      }}
                      variant="outlined"
                    >
                      GitHub
                    </Button>
                  </a>
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

        {/* Features Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 13,
            my: 5,
            // px: 2,
            px: { xs: 2, md: 15, sm: 10, lg: 25 },
            zIndex: 1,
            position: 'relative',
            bgcolor: '#F3F3F3'
          }}
        >
          <Typography className="header" variant="h4">
            Key Features
          </Typography>
          <Typography variant="subtitle1" sx={{ py: 6 }}>
            From API access to real-time analytics and a full-featured dashboard, <br />
            <span style={{ fontWeight: 'bold' }}>ShortMesh</span> gives you all the tools to build, monitor, and manage social inboxes—your
            way.
          </Typography>

          <Grid container spacing={6} justifyContent="center" mt={{ md: 6, xs: 4, lg: 10 }}>
            <FeatureCard
              icon={<ApiOutlined />}
              title="API Access"
              description="Get secure API keys instantly and start integrating social inboxes with minimal setup."
            />
            <FeatureCard
              icon={<LineChartOutlined />}
              title="Usage Analytics"
              description="Track your API usage—requests, errors, rate limits, and performance, all in one place."
            />
            <FeatureCard
              icon={<DashboardOutlined />}
              title="Insightful Dashboard"
              description="View detailed usage stats, monitor activity, and explore message data through a clean, intuitive dashboard."
            />
            <FeatureCard
              icon={<MessageOutlined />}
              title="Message Visibility"
              description="View all received and sent messages across connected social platforms through the API or dashboard."
            />
            <FeatureCard
              icon={<UsergroupAddOutlined />}
              title="Multi-Platform Support"
              description="Easily connect and manage multiple social media platforms—add new ones anytime from the dashboard."
            />
            <FeatureCard
              icon={<SecurityScanOutlined />}
              title="End-to-end Encryption"
              description="Easily connect and manage multiple social media platforms—add new ones anytime from the dashboard."
            />
          </Grid>
        </Box>

        {/* More Section */}
        <Box sx={{ my: { xs: 15, md: 20, ld: 25 }, mx: { xs: 2, md: 15, lg: 25 } }}>
          <Typography className="header" variant="h4" textAlign="center">
            Built For Everyone
          </Typography>
          <Typography variant="subtitle1" sx={{ py: 6 }} textAlign="center">
            Whether you're building the next big thing or just need a clearer view of your messages, <br />
            <span style={{ fontWeight: 'bold' }}>ShortMesh</span> has you covered.
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
                  borderRadius: 2,
                  px: { md: 10, xs: 2 },
                  py: 1
                  // display: "inline-flex",
                }}
              >
                <TabList onChange={handleUserTabChange} TabIndicatorProps={{ style: { display: 'none' } }} textColor="primary">
                  <Tab
                    label="Developers"
                    value="developers"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 1,
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
                      borderRadius: 1,
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
                  <a href="mailto:developers@smswithoutborders.com?subject=Request%20Demo&body=Hi%20ShortMesh%20Team,%0A%0AI'd%20like%20to%20request%20a%20demo%20of%20your%20platform.%0A%0AThanks!">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        bgcolor: '#000000',
                        color: '#ffffff'
                      }}
                    >
                      Request Demo
                    </Button>
                  </a>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 0,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: '#F3F3F3',
                      color: '#000000',
                      fontFamily: 'monospace',
                      minHeight: '300px'
                    }}
                  >
                    <TabContext value={codeTab}>
                      <TabList
                        onChange={handleCodeTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{
                          backgroundColor: '#D8D8D8',
                          px: 2
                        }}
                      >
                        <Tab
                          label="JavaScript"
                          value="js"
                          sx={{
                            textTransform: 'none',
                            color: '#000000',
                            '&.Mui-selected': {
                              color: '#000000',
                              borderBottom: '2px solid #00ff99'
                            }
                          }}
                        />
                        <Tab
                          label="cURL"
                          value="curl"
                          sx={{
                            textTransform: 'none',
                            color: '#000000',
                            '&.Mui-selected': {
                              color: '#000000',
                              borderBottom: '2px solid #00ff99'
                            }
                          }}
                        />
                      </TabList>

                      <TabPanel value="js" sx={{ p: 2 }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          <code>{codeSnippets.js}</code>
                        </pre>
                      </TabPanel>

                      <TabPanel value="curl" sx={{ p: 2 }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          <code>{codeSnippets.curl}</code>
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
                    Get a real-time view of all customer conversations in one place. Monitor engagement and manage your team efficiently.
                  </Typography>
                  <a href="mailto:developers@smswithoutborders.com?subject=Request%20Demo&body=Hi%20ShortMesh%20Team,%0A%0AI'd%20like%20to%20request%20a%20demo%20of%20your%20platform.%0A%0AThanks!">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        bgcolor: '#000000',
                        color: '#ffffff'
                      }}
                    >
                      Request Demo
                    </Button>
                  </a>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      p: 0,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: '#F3F3F3',
                      color: '#000000',
                      fontFamily: 'monospace',
                      minHeight: '300px'
                    }}
                  >
                    <TabContext value={codeTab}>
                      <TabList
                        onChange={handleCodeTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{
                          backgroundColor: '#D8D8D8',
                          px: 2
                        }}
                      >
                        <Tab
                          label="JavaScript"
                          value="js"
                          sx={{
                            textTransform: 'none',
                            color: '#000000',
                            '&.Mui-selected': {
                              color: '#000000',
                              borderBottom: '2px solid #00ff99'
                            }
                          }}
                        />
                        <Tab
                          label="cURL"
                          value="curl"
                          sx={{
                            textTransform: 'none',
                            color: '#000000',
                            '&.Mui-selected': {
                              color: '#000000',
                              borderBottom: '2px solid #00ff99'
                            }
                          }}
                        />
                      </TabList>

                      <TabPanel value="js" sx={{ p: 2 }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          <code>{codeSnippets.js}</code>
                        </pre>
                      </TabPanel>

                      <TabPanel value="curl" sx={{ p: 2 }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          <code>{codeSnippets.curl}</code>
                        </pre>
                      </TabPanel>
                    </TabContext>
                  </Card>
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
