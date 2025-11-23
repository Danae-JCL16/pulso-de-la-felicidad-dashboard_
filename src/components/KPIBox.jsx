import React, { useContext } from "react";
import "./KPIBox.css";
import { HappinessContext } from "./HappinessProvider";

function KPIBox({ filters }) {
  const { happinessData, loading } = useContext(HappinessContext);

  if (loading) return <p>Cargando KPIs...</p>;
  if (!happinessData || happinessData.length === 0) return <p>No hay datos disponibles</p>;

  // Filtrar datos según los filtros activos
  const filteredData = happinessData.filter(item => {
    return (
      (!filters.year || (item.year >= filters.year[0] && item.year <= filters.year[1])) &&
      (!filters.region || item.regional_indicator === filters.region) &&
      (!filters.country || item.country === filters.country)
    );
  });  

  // Calcular KPIs con seguridad (evita NaN si hay campos vacíos)
  const avgHappiness = (
    filteredData.reduce((sum, item) => sum + Number(item.happiness_score || 0), 0) /
    (filteredData.length || 1)
  ).toFixed(2);

  const avgGDP = (
    filteredData.reduce((sum, item) => sum + Number(item.gdp_per_capita || 0), 0) /
    (filteredData.length || 1)
  ).toLocaleString();

  const avgSocialSupport = (
    filteredData.reduce((sum, item) => sum + Number(item.social_support || 0), 0) /
    (filteredData.length || 1)
  ).toFixed(2);

  const avgFreedom = (
    filteredData.reduce((sum, item) => sum + Number(item.freedom_to_make_life_choices || 0), 0) /
    (filteredData.length || 1)
  ).toFixed(2);

  const avgCorruption = (
    filteredData.reduce((sum, item) => sum + Number(item.perceptions_of_corruption || 0), 0) /
    (filteredData.length || 1)
  ).toFixed(2);

  return (
    <div className="kpi-container">
      <div className="kpi-card">
        <img src="/images/kpi1.png" alt="kpi1" className="kpi-icon" />
        <p className="kpi-label">Índice de felicidad global promedio</p>
        <h2 className="kpi-value">{avgHappiness}</h2>
      </div>

      <div className="kpi-card">
        <img src="/images/kpi2.png" alt="kpi2" className="kpi-icon" />
        <p className="kpi-label">PIB per cápita</p>
        <h2 className="kpi-value">{avgGDP} USD</h2>
      </div>

      <div className="kpi-card">
        <img src="/images/kpi3.png" alt="kpi3" className="kpi-icon" />
        <p className="kpi-label">Apoyo social</p>
        <h2 className="kpi-value">{avgSocialSupport}</h2>
      </div>

      <div className="kpi-card">
        <img src="/images/kpi4.png" alt="kpi4" className="kpi-icon" />
        <p className="kpi-label">Libertad para tomar decisiones personales</p>
        <h2 className="kpi-value">{avgFreedom}</h2>
      </div>

      <div className="kpi-card">
        <img src="/images/kpi5.png" alt="kpi5" className="kpi-icon" />
        <p className="kpi-label">Percepción de corrupción</p>
        <h2 className="kpi-value">{avgCorruption}</h2>
      </div>
    </div>
  );
}

export default KPIBox;
