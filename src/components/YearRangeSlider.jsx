import React from "react";
import Slider from "@mui/material/Slider";

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function YearRangeSlider({ value, onChange }) {
  return (
    <div className="filtro-grupo">
      <label>Año</label>
      <Slider
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        step={1}
        marks={false}
        min={Math.min(...years)}
        max={Math.max(...years)}
        sx={{
          color: "#FF7F11",
          width: 220,
          marginTop: "10px",
          "& .MuiSlider-valueLabel": {
            backgroundColor: "#FF7F11",
            color: "white",
            fontSize: "0.75rem",
            borderRadius: "4px",
          },
          "& .MuiSlider-markLabel": {
            fontSize: "0.8rem",
            color: "#333",
          },
        }}
      />
    </div>
  );
}

export default YearRangeSlider;
