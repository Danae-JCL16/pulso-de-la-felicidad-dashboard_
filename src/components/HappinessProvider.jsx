import React, { createContext, useState, useEffect } from "react";
import Papa from "papaparse";

export const HappinessContext = createContext();

function HappinessProvider({ children }) {
  const [happinessData, setHappinessData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(`${import.meta.env.BASE_URL}happiness_clean.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      complete: (result) => {
        console.log("CSV original:", result.data.slice(0, 3)); // primeras 3 filas para verificar

        const cleanedData = result.data.map((row) => ({
          ranking: Number(row["Ranking"]),
          country: row["Country"],
          regional_indicator: row["Regional indicator"],
          happiness_score: Number(row["Happiness score"]),
          gdp_per_capita: Number(row["GDP per capita"]),
          social_support: Number(row["Social support"]),
          healthy_life_expectancy: Number(row["Healthy life expectancy"]),
          freedom_to_make_life_choices: Number(row["Freedom to make life choices"]),
          generosity: Number(row["Generosity"]),
          perceptions_of_corruption: Number(row["Perceptions of corruption"]),
          year: Number(row["Year"]),
        }));

        console.log("Datos procesados:", cleanedData.slice(0, 3));

        setHappinessData(cleanedData);
        setLoading(false);
      },

      error: (err) => {
        console.error("Error al cargar CSV:", err);
        setLoading(false);
      },
    });
  }, []);

  return (
    <HappinessContext.Provider value={{ happinessData, loading }}>
      {children}
    </HappinessContext.Provider>
  );
}

export default HappinessProvider;
