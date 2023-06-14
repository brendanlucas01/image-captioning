import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import React from 'react'
import { Button } from '@mui/material';
import "./styles.css";

const brendanButton = {backgroundColor:"#2c1e89",color:"#ffffff",borderRadius:"25px"}

function ButtonArea() {
  return (
    <div>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{textAlign:"center"}}>
            <Grid xs={6}>
            <Button style={brendanButton} variant="Contained">Full Analysis</Button>
            </Grid>
            <Grid xs={6}>
            <Button style={brendanButton}>Pre Analysis Results</Button>
            </Grid>
            {/* <Grid xs={6}>
                <Item>3</Item>
            </Grid>
            <Grid xs={6}>
                <Item>4</Item>
            </Grid> */}
        </Grid>
    </div>
  )
}

export default ButtonArea