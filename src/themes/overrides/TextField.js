// ==============================|| OVERRIDES - TEXT FIELD ||============================== //

export default function TextField(theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: theme.palette?.grey?.[600] || '#666666',
            '&.Mui-focused': {
              color: theme.palette?.primary?.main || '#1976d2'
            },
            '&.Mui-error': {
              color: theme.palette?.error?.main || '#d32f2f'
            }
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f7f7f7', // light gray background
            '&:hover': {
              backgroundColor: '#f0f0f0' // slightly darker on hover
            },
            '&.Mui-focused': {
              backgroundColor: '#fff' // white on focus (optional, for clarity)
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette?.grey?.[300] || '#e0e0e0'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette?.primary?.light || '#42a5f5'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette?.primary?.main || '#1976d2',
              borderWidth: '1px'
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette?.error?.main || '#d32f2f'
            }
          },
          '& .MuiFormHelperText-root': {
            color: theme.palette?.grey?.[500] || '#757575',
            fontSize: '0.75rem',
            marginTop: 4,
            '&.Mui-error': {
              color: theme.palette?.error?.main || '#d32f2f'
            }
          }
        }
      }
    }
  };
}
