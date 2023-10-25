'use client';

import styles from './page.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Campaign, PlayCircle } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

type VocabularyData = {
  id: number;
  word: string;
  syllables: string;
  date: Date;
}

const Home = () => {
  const speakingLock = useRef(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [rows, setRows] = useState([] as VocabularyData[]);
  const [cards, setCards] = useState([] as VocabularyData[]);
  const [cardIndex, setCardIndex] = useState(0);
  
  const synth = global.speechSynthesis;
  let id: NodeJS.Timeout;


  useEffect(() => {
    const fetchData = async () => {
      const { success, data } = await fetch('/api').then(res => res.json());
      
      success && setRows(data);
    };

    fetchData();
  }, [])

  // Currying Function
  const speak = (times: number) => (word: string) => {
    
    const utterThis = new SpeechSynthesisUtterance(word);
    
    const readout = (count: number) => {
      speakingLock.current = count < times - 1;

      if (synth.speaking) {
        clearInterval(id);
        synth.cancel();
        speakingLock.current = false;
      }
      utterThis.rate = 0.5;
      synth.speak(utterThis);
    };

    for (let i = 0; i < times; i++) {
      id = setTimeout(() => readout(i), i * 2000);
    }
  };

  // Speak 1-time
  const speakOnce = speak(1);
  // Speak 3-time
  const speakTripleTimes = speak(3);

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', sortable: false, width: 50 },
    {
      field: 'word',
      headerName: 'Word',
      sortable: false,
      width: 200,
    },
    {
      field: 'syllables',
      headerName: 'Syllables',
      sortable: false,
      width: 200,
    },
    {
      field: 'date',
      headerName: 'Date',
      sortable: false,
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        const onClick = () => {
          const {
            row: { word },
          } = params;
          speakOnce(word);
        };

        return (
          <IconButton aria-label="delete" onClick={onClick}>
            <Campaign />
          </IconButton>
        );
      },
    },
  ];

  const randomCard: VocabularyData[] = useMemo(() => {
    return [...rows].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [rows]);

  const handleDialogOpen = async () => {
    speakTripleTimes(randomCard[0].word);
    setCards(randomCard);
    setCardIndex(0);
    setDialogShow(true);
  };

  const handleDialogClose = (_?: Object, reason?: string) => {
    // Don't close the dialog if user clicks outside of it.
    // We would only accept user to close the dialog from the "CLOSE" button.
    if (reason && reason === "backdropClick") return;
    if (reason && reason === "escapeKeyDown") return;
    setDialogShow(false); 
  };

  const handleDialogNext = () => {
    if (speakingLock.current) return;

    const index = cardIndex + 1;

    speakTripleTimes(cards[index].word);
    setCardIndex(index);
  };

  const DataGridTitle = () => {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            flex: 1,
          }}
        >
          Vocabulary
        </Typography>
        <Tooltip title="Display Flashcards">
          <IconButton
            sx={{
              paddingRight: '10px',
            }}
            onClick={handleDialogOpen}
          >
            <PlayCircle />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const buttons = useMemo(() => {
    if (cards.length > cardIndex + 1) {
      return (
        <Button
          onClick={handleDialogNext}
          sx={{
            fontWeight: 'bold',
          }}
          hidden={cardIndex + 1 === cards.length}
        >
          Next
        </Button>
      );
    } else {
      return (
        <Button
          onClick={handleDialogClose}
          sx={{
            fontWeight: 'bold',
          }}
          hidden={cardIndex + 1 < cards.length}
        >
          Close
        </Button>
      );
    }
  }, [cards, cardIndex]);

  return (
    <main className={styles.main} style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          <DataGrid
            slots={{
              toolbar: DataGridTitle,
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
        <Dialog fullScreen open={dialogShow} onClose={handleDialogClose}>
          <DialogTitle
            sx={{
              backgroundColor: 'black',
              color: 'white',
              fontSize: '60px',
              fontWeight: 'bold',
            }}
          >
            Flashcards
          </DialogTitle>
          <DialogContent
            dividers={true}
            sx={{
              width: '100%',
              height: '100%',
              paddingTop: '0',
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography 
                sx={{
                  fontSize: '180px',
                }}
              >
                {cards[cardIndex]?.word}
              </Typography>
              <Typography
                sx={{
                  fontSize: '60px',
                }}
              >
                {cards[cardIndex]?.syllables}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: 'black',
            }}
          >
            {buttons}
          </DialogActions>
        </Dialog>
      </Box>
    </main>
  );
};

export default Home;
