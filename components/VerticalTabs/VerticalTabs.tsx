import { ReactNode, SyntheticEvent, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import TabPanel from './TabPanel';

// Define the relationship between tab and panel.
interface TabProps {
  title: string;
  el: ReactNode;
}

interface TabsProps {
  panels: TabProps[];
}

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const VerticalTabs = (props: TabsProps) => {
  const { panels } = props;
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs: ReactNode[] = [],
    pages: ReactNode[] = [];

  panels.map((panel: TabProps, index: number) => {
    const { title, el } = panel;

    tabs.push(
      <Tab
        key={`tab-${index}`}
        sx={{
          fontSize: '18px',
          fontWeight: 'bold',
          height: '5rem',
          color: 'white',
          backgroundColor: value === index ? 'white' : '#222222',
        }}
        label={title}
        {...a11yProps(index)}
      />
    );
    pages.push(
      <TabPanel key={`tabpanel-${index}`} value={value} index={index}>
        {el}
      </TabPanel>
    );
  });

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '15px',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          width: '200px',
          bgcolor: '#222222',
          borderRadius: '15px 0 0 15px',
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: 'white',
          },
        }}
      >
        {tabs}
      </Tabs>
      {pages}
    </Box>
  );
};

export default VerticalTabs;
