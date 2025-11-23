import React, { useContext, useState } from "react";
import { HappinessContext } from "./HappinessProvider";
import MenuLateral from "./MenuLateral";
import YearRangeSlider from "./YearRangeSlider";
import {
  ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import "../index.css";
import "./Graficos.css";

function VistaSocial() {
  const { happinessData } = useContext(HappinessContext);
  const [filters, setFilters] = useState({
    year: [2018, 2023],
    region: "Todos",
    country: "Todos",
  });

  const filteredData = happinessData.filter(item => (
    item.year >= filters.year[0] && item.year <= filters.year[1] &&
    (filters.region === "Todos" || item.regional_indicator === filters.region) &&
    (filters.country === "Todos" || item.country === filters.country)
  ));

  const regions = [...new Set(happinessData.map(d => d.regional_indicator))];
  const countries = [...new Set(happinessData.map(d => d.country))];

  const buildChart = (xKey, yKey, xLabel, yLabel, color) => (
    <div className="grafico">
      <h3>{`${xLabel.toUpperCase()} VS. ${yLabel.toUpperCase()}`}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid stroke="#e0e0e0" />
          <XAxis
            dataKey={xKey}
            name={xLabel}
            type="number"
            label={{ value: xLabel, position: "insideBottom", offset: -5 }}
          />
          <YAxis
            dataKey={yKey}
            name={yLabel}
            type="number"
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Scatter
            data={filteredData.map(item => ({
              [xKey]: item[xKey],
              [yKey]: item[yKey],
              country: item.country,
            }))}
            fill={color}
            stroke="#000"
            strokeWidth={1.5}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  const selectedCountry = filters.country !== "Todos"
    ? filteredData.find(item => item.country === filters.country)
    : null;

  const getTopCountry = (key) => {
    const sorted = happinessData
      .filter(d => d[key] != null)
      .sort((a, b) => b[key] - a[key]);
    return sorted[0] ? { country: sorted[0].country, value: sorted[0][key].toFixed(2) } : null;
  };

  const topSupport = getTopCountry("social_support");
  const topFreedom = getTopCountry("freedom_to_make_life_choices");
  const topGenerosity = getTopCountry("generosity");
  const topAntiCorruption = getTopCountry("perceptions_of_corruption");

  return (
    <div className="dashboard">
      <MenuLateral />
      <div className="contenido">
        <div className="encabezado">
          <div className="titulo_dashboard">
            <h1>
              <img src="/images/icono.png" alt="icono social" className="icono_titulo" />
              Bienestar y Factores Sociales
            </h1>
          </div>

          <div className="filtros">
            <YearRangeSlider
              value={filters.year}
              onChange={(newRange) => setFilters((prev) => ({ ...prev, year: newRange }))}
            />
            <div className="filtro">
              <label>Región/Continente</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option value="Todos">Todos</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="filtro">
              <label>País</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              >
                <option value="Todos">Todos</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="descripcion-social">
          Esta sección permite explorar cómo distintos factores sociales influyen en el bienestar de los países. Puedes seleccionar un rango de años, región o país para observar patrones y comparaciones.
        </p>

        {selectedCountry && (
          <div className="perfil-social">
            <h3>Perfil social de {selectedCountry.country}</h3>
            <ul>
              <li>Apoyo social: {selectedCountry.social_support.toFixed(2)}</li>
              <li>Libertad: {selectedCountry.freedom_to_make_life_choices.toFixed(2)}</li>
              <li>Generosidad: {selectedCountry.generosity.toFixed(2)}</li>
              <li>Percepción de corrupción: {selectedCountry.perceptions_of_corruption.toFixed(2)}</li>
            </ul>
          </div>
        )}

        <div className="tabla-social">
          <h3>Países líderes por factor social</h3>
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>País líder</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Apoyo social</td>
                <td>{topSupport?.country}</td>
                <td>{topSupport?.value}</td>
              </tr>
              <tr>
                <td>Libertad</td>
                <td>{topFreedom?.country}</td>
                <td>{topFreedom?.value}</td>
              </tr>
              <tr>
                <td>Generosidad</td>
                <td>{topGenerosity?.country}</td>
                <td>{topGenerosity?.value}</td>
              </tr>
              <tr>
                <td>Corrupción baja</td>
                <td>{topAntiCorruption?.country}</td>
                <td>{topAntiCorruption?.value}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 ? (
          <p>No hay datos disponibles para los filtros seleccionados.</p>
        ) : (
          <div className="graficos-grid">
            {buildChart("social_support", "happiness_score", "Apoyo social", "Felicidad", "#4DA3FF")}
            {buildChart("freedom_to_make_life_choices", "happiness_score", "Libertad", "Felicidad", "#FFA94D")}
            {buildChart("generosity", "happiness_score", "Generosidad", "Felicidad", "#F7C948")}
            {buildChart("perceptions_of_corruption", "happiness_score", "Corrupción", "Felicidad", "#B0ADA5")}
          </div>
        )}
      </div>
    </div>
  );
}

export default VistaSocial;
