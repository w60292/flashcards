import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...otherProps } = props;

  return (
    <div
      role="tabpanel"
      id={`vertical-tabpanel-${index}`}
      style={{ width: '100%' }}
      aria-labelledby={`vertical-tab-${index}`}
      hidden={value !== index}
      {...otherProps}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
