import React, { useContext, useEffect, useState } from "react";
import { HappinessContext } from "./HappinessProvider";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Graficos.css";

function Graficos({ filters }) {
  const { happinessData } = useContext(HappinessContext);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/world-countries.json")
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  const filteredData = happinessData.filter(item => {
    const [inicio, fin] = filters.year;
    const coincideAño = !filters.year || (item.year >= inicio && item.year <= fin);
    const coincideRegion = !filters.region || item.regional_indicator === filters.region;
    const coincidePais = !filters.country || item.country === filters.country;
    return coincideAño && coincideRegion && coincidePais;
  });

  if (!filteredData || filteredData.length === 0) {
    return <div className="graficos"><p>No hay datos para los filtros actuales.</p></div>;
  }

  const happinessTrendData = Object.entries(
    filteredData.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(item.happiness_score);
      return acc;
    }, {})
  ).map(([year, scores]) => ({
    year,
    avg: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)),
  }));

  const corruptionData = filteredData.map(item => ({
    corruption: item.perceptions_of_corruption,
    ranking: item.ranking,
    country: item.country,
  }));

  const gdpRankingData = filteredData.map(item => ({
    gdp: item.gdp_per_capita * 100000,
    ranking: item.ranking,
    country: item.country,
  }));

  const buildTrendLine = (points) => {
    const xs = points.map(p => p.gdp);
    const ys = points.map(p => p.ranking);
    const n = points.length;
    if (n < 2) return [];
    const meanX = xs.reduce((a,b)=>a+b,0)/n;
    const meanY = ys.reduce((a,b)=>a+b,0)/n;
    const num = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0);
    const den = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0) || 1;
    const m = num / den;
    const b = meanY - m * meanX;
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    return [
      { gdp: minX, ranking: m * minX + b },
      { gdp: maxX, ranking: m * maxX + b },
    ];
  };
  const trendLine = buildTrendLine(gdpRankingData);

  const gdpGenerosityData = filteredData.map(item => ({
    gdp: item.gdp_per_capita * 100000,
    generosity: item.generosity,
    country: item.country,
  }));

  const countryLifeMap = {};
  filteredData.forEach(item => {
    countryLifeMap[item.country] = {
      life: Number(item.healthy_life_expectancy) || 0,
      ranking: Number(item.ranking) || 0,
    };
  });

  const getColor = (life) => {
    if (life == null) return "#ccc";
    if (life >= 0.7) return "#4DA3FF";
    if (life >= 0.5) return "#FFA94D";
    return "#B0ADA5";
  };

  const geoStyle = (feature) => {
    const country = feature.properties.name;
    const data = countryLifeMap[country];
    return {
      fillColor: data ? getColor(data.life) : "#ccc",
      weight: 1,
      color: "#999",
      fillOpacity: 0.85,
    };
  };

  return (
    <div className="graficos">
      <div className="graficos-grid">
        {/* 1. Línea: Felicidad promedio */}
        <div className="grafico">
          <h3>ÍNDICE DE FELICIDAD GLOBAL PROMEDIO</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={happinessTrendData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[5.0, 5.6]} />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#f7c948" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Corrupción vs ranking */}
        <div className="grafico">
          <h3>PERCEPCIÓN DE CORRUPCIÓN VS. RANKING DE FELICIDAD</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="corruption" name="Corrupción" type="number" label={{ value: "Percepción de corrupción", position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="ranking" name="Ranking" type="number" reversed label={{ value: "Ranking de felicidad", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Scatter data={corruptionData} fill="#f39c12" stroke="#000" strokeWidth={1} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 3. PIB vs ranking */}
        <div className="grafico">
          <h3>PIB PER CÁPITA VS. RANKING DE FELICIDAD</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="gdp" type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} label={{ value: "PIB per cápita (USD)", position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="ranking" type="number" reversed domain={[0, 160]} label={{ value: "Ranking de felicidad", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Scatter data={gdpRankingData} fill="#f39c12" stroke="#000" strokeWidth={1} />
              {trendLine.length === 2 && (
                <Line
                  type="linear"
                  data={trendLine}
                  dataKey="ranking"
                  stroke="#3498db"
                  strokeWidth={3}
                  dot={false}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 4. PIB vs generosidad */}
        <div className="grafico">
          <h3>PIB PER CÁPITA VS GENEROSIDAD</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="gdp" type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} label={{ value: "PIB per cápita (USD)", position: "insideBottom", offset: -5 }} />
              <YAxis dataKey="generosity" type="number" label={{ value: "Generosidad", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Scatter data={gdpGenerosityData} fill="#f39c12" stroke="#000" strokeWidth={1} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Mapa: Esperanza de vida vs ranking */}
        <div className="grafico mapa-expandido">
        <div className="grafico">
          <h3>ESPERANZA DE VIDA SALUDABLE VS. RANKING DE FELICIDAD</h3>
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "300px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geoData && (
              <GeoJSON
                data={geoData}
                style={geoStyle}
                onEachFeature={(feature, layer) => {
                  const country = feature.properties.name;
                  const data = countryLifeMap[country];
                  if (data) {
                    layer.bindTooltip(
                      `${country}<br/>Ranking: ${data.ranking}<br/>Vida saludable: ${data.life.toFixed(2)}`
                    );
                  }
                }}
              />
            )}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-swatch" style={{ backgroundColor: "#4DA3FF" }}></span>
                <span>Esperanza de vida alta (≥ 0.7)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch" style={{ backgroundColor: "#FFA94D" }}></span>
              <span>Esperanza de vida media (0.5–0.69)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch" style={{ backgroundColor: "#B0ADA5" }}></span>
              <span>Esperanza de vida baja (&lt; 0.5)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch" style={{ backgroundColor: "#ccc" }}></span>
              <span>Sin datos</span>
            </div>
          </div>
          </MapContainer>
          

        </div>
        </div>
      </div>
    </div>
  );
}

export default Graficos;

