import React, { useContext, useEffect, useMemo, useState } from "react";
import { HappinessContext } from "./HappinessProvider";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MenuLateral from "./MenuLateral";
import YearRangeSlider from "./YearRangeSlider";
import "./Graficos.css";
import "../index.css";
import "./MapaMundial.css";

function MapaMundial() {
  const { happinessData } = useContext(HappinessContext);
  const [geoData, setGeoData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filters, setFilters] = useState({
    year: [2018, 2023],
    region: "Todos",
    country: "Todos",
  });

  useEffect(() => {
    fetch("/world-countries.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setGeoData(d))
      .catch((err) => console.error("Error cargando world-countries.json", err));
  }, []);

  const geoToDataset = (name) => {
    const map = {
      "United States of America": "United States",
      "United States": "United States",
      "Russian Federation": "Russia",
      "Russia": "Russia",
      "Côte d'Ivoire": "Ivory Coast",
      "Ivory Coast": "Ivory Coast",
      "Republic of the Congo": "Congo (Brazzaville)",
      "Democratic Republic of the Congo": "Congo (Kinshasa)",
      "Congo": "Congo (Brazzaville)",
      "Korea, South": "South Korea",
      "South Korea": "South Korea",
      "Korea, North": "North Korea",
      "North Korea": "North Korea",
      "Eswatini": "Eswatini",
      "Swaziland": "Swaziland",
      "North Macedonia": "North Macedonia",
      "Macedonia": "North Macedonia",
      "Hong Kong S.A.R. of China": "Hong Kong S.A.R. of China",
      "Hong Kong": "Hong Kong",
      "Taiwan Province of China": "Taiwan Province of China",
      "Taiwan": "Taiwan",
      "Trinidad & Tobago": "Trinidad & Tobago",
      "Trinidad and Tobago": "Trinidad and Tobago",
      "State of Palestine": "State of Palestine",
      "Palestinian Territories": "Palestinian Territories",
      "United Republic of Tanzania": "Tanzania",
      "The Bahamas": "Bahamas",
      "Bolivia": "Bolivia",
      "Czechia": "Czechia",
      "Czech Republic": "Czech Republic",
      "Turkiye": "Turkey",
      "Turkey": "Turkey",
      "Venezuela": "Venezuela",
      "Myanmar": "Myanmar",
      "Burma": "Myanmar",
      "Cape Verde": "Cabo Verde",
      "Cabo Verde": "Cabo Verde",
      "Somaliland": "Somaliland region",
      "Somaliland region": "Somaliland region",
    };
    return map[name] || name;
  };

  const filteredData = useMemo(() => {
    if (!happinessData || happinessData.length === 0) return [];
    return happinessData.filter((item) => {
      const withinYear = item.year >= filters.year[0] && item.year <= filters.year[1];
      const withinRegion = filters.region === "Todos" || item.regional_indicator === filters.region;
      const withinCountry =
        filters.country === "Todos" || item.country === filters.country || item.country === selectedCountry;
      return withinYear && withinRegion && withinCountry;
    });
  }, [happinessData, filters, selectedCountry]);

  const countryMap = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      map[item.country] = {
        happiness: item.happiness_score,
        ranking: item.ranking,
        gdp: item.gdp_per_capita,
        life: item.healthy_life_expectancy,
        corruption: item.perceptions_of_corruption,
      };
    });
    return map;
  }, [filteredData]);

  const maxScore = useMemo(() => {
    const vals = filteredData.map((d) => d.happiness_score).filter((v) => v != null);
    return vals.length ? Math.max(...vals) : 0;
  }, [filteredData]);

  const getColor = (score) => {
    if (score == null) return "#ccc";
    if (maxScore <= 1) {
      if (score >= 0.7) return "#4DA3FF";
      if (score >= 0.5) return "#FFA94D";
      return "#B0ADA5";
    }
    if (score >= 7) return "#4DA3FF";
    if (score >= 5) return "#FFA94D";
    return "#B0ADA5";
  };

  const geoStyle = (feature) => {
    const raw = feature.properties && (feature.properties.name || feature.properties.NAME);
    const country = geoToDataset(raw);
    const data = countryMap[country];
    const isSelected = selectedCountry === country;

    return {
      fill: true,
      fillColor: isSelected ? "#1E6BD6" : getColor(data?.happiness),
      fillOpacity: 0.9,
      color: isSelected ? "#0f3c7a" : "#999",
      weight: isSelected ? 2 : 1,
    };
  };

  const regions = useMemo(() => {
    if (!happinessData) return [];
    return [...new Set(happinessData.map((d) => d.regional_indicator))];
  }, [happinessData]);

  const countries = useMemo(() => {
    if (!happinessData) return [];
    return [...new Set(happinessData.map((d) => d.country))].sort();
  }, [happinessData]);

  const Legend = () => (
    <div className="map-legend">
      <div className="legend-item">
        <span className="legend-swatch" style={{ backgroundColor: "#4DA3FF" }}></span>
        <span>Felicidad alta</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ backgroundColor: "#FFA94D" }}></span>
        <span>Felicidad media</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ backgroundColor: "#B0ADA5" }}></span>
        <span>Felicidad baja</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ backgroundColor: "#1E6BD6" }}></span>
        <span>País seleccionado</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ backgroundColor: "#ccc" }}></span>
        <span>Sin datos</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <MenuLateral />
      <div className="contenido">
        <div className="encabezado">
          <div className="titulo_dashboard">
            <img src="/images/icono.png" alt="icono felicidad" className="icono_titulo" />
            <h1>Mapa Mundial</h1>
          </div>

          <div className="filtros">
            <YearRangeSlider
              value={filters.year}
              onChange={(newRange) => setFilters((prev) => ({ ...prev, year: newRange }))}
            />
            <div className="filtro">
              <label>Región/Continente</label>
              <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
                <option value="Todos">Todos</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro">
              <label>País</label>
              <select
                value={filters.country}
                onChange={(e) => {
                  const c = e.target.value;
                  setFilters((prev) => ({ ...prev, country: c }));
                  setSelectedCountry(c === "Todos" ? null : c);
                }}
              >
                <option value="Todos">Todos</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="descripcion-social">Selecciona un rango de años, región o país. Haz clic en un país del mapa para ver detalles.</p>

        {filteredData.length === 0 ? (
          <p>No hay datos disponibles para los filtros seleccionados.</p>
        ) : (
          <>
            <div className="mapa-container">
              <MapContainer center={[20, 0]} zoom={2}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoData && (
                  <GeoJSON
                    key={JSON.stringify({ filters, selectedCountry })}
                    data={geoData}
                    style={geoStyle}
                    onEachFeature={(feature, layer) => {
                      const raw = feature.properties && (feature.properties.name || feature.properties.NAME);
                      const country = geoToDataset(raw);
                      const data = countryMap[country];

                      if (!data) {
                        console.debug("Geo sin match ->", raw, "normalizado->", country);
                        layer.bindTooltip(`${country}<br/>Sin datos`, { sticky: true });
                      } else {
                        layer.bindTooltip(
                          `${country}<br/>
                          Felicidad: ${Number(data.happiness).toFixed(2)}<br/>
                          Ranking: ${data.ranking}<br/>
                          PIB: ${Number(data.gdp).toFixed(2)}<br/>
                          Vida saludable: ${Number(data.life).toFixed(2)}<br/>
                          Corrupción: ${Number(data.corruption).toFixed(2)}`,
                          { sticky: true }
                        );
                      }

                      layer.on("click", () => {
                        setSelectedCountry(country);
                        setFilters((prev) => ({ ...prev, country }));
                      });
                    }}
                  />
                )}
              </MapContainer>

              <Legend />
            </div>

            {selectedCountry && countryMap[selectedCountry] && (
              <div className="datos-pais">
                <h3>Datos de {selectedCountry}</h3>
                <ul>
                  <li>Felicidad: {Number(countryMap[selectedCountry].happiness).toFixed(2)}</li>
                  <li>Ranking: {countryMap[selectedCountry].ranking}</li>
                  <li>PIB per cápita: {Number(countryMap[selectedCountry].gdp).toFixed(2)}</li>
                  <li>Esperanza de vida saludable: {Number(countryMap[selectedCountry].life).toFixed(2)}</li>
                  <li>Percepción de corrupción: {Number(countryMap[selectedCountry].corruption).toFixed(2)}</li>
                </ul>
                <button
                  className="btn-limpiar"
                  onClick={() => {
                    setSelectedCountry(null);
                    setFilters((prev) => ({ ...prev, country: "Todos" }));
                  }}
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MapaMundial;




