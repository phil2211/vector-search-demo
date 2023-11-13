import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { TextField, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const GET_FINMA_DATA = gql`
query finmaVectorSearch (
  $searchText: String,
  $startRow: Int,
  $endRow: Int
) {
  finmaVectorSearch(
    input: {
      searchText: $searchText
      startRow: $startRow
      endRow: $endRow
    }
  ) {
    lastRow
    rows {
      filename
      url
    }
  }
}
`;

function Finma() {
  const [searchText, setSearchText] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_FINMA_DATA, {
    variables: { searchText: "", startRow: 0, endRow: 20 }
  });

  const handleSearch = () => {
    refetch({ searchText: searchText });
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Grid container spacing={2} style={{ padding: '20px', marginBottom: '20px' }}>
        <Grid item xs={10} sm={11}>
          <TextField 
            label="Search" 
            variant="outlined" 
            fullWidth
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginRight: '10px' }}
            InputProps={{
              style: { fontSize: '2rem' } // Adjust font size here
            }}
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <Button 
            variant="contained" 
            onClick={handleSearch}
            fullWidth
            sx={{ height: '100%' }}
            >Search
          </Button>
        </Grid>
      </Grid>
    <Grid container spacing={2} style={{ padding: '20px' }}>
      {data.finmaVectorSearch.rows.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.filename}
              </Typography>
              <Button 
                size="small" 
                onClick={() => window.open(item.url, '_blank')}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </div>
  );
}

export default Finma;
