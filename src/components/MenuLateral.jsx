import React from "react";
import { Link } from "react-router-dom";
import "./MenuLateral.css";

function MenuLateral() {
    return (
    <div className="menu_dashboard">
        <div className="iconos">
            <Link to="/">
                <img src="/images/icono1.png" alt="Inicio" className="icono_tamaño" />
                </Link>
            <Link to="/mapa">
                <img src="/images/icono2.png" alt="Mapa mundial" className="icono_tamaño"/>
                </Link>
            <Link to="/social">
                <img src="/images/icono3.png" alt="Bienestar social" className="icono_tamaño"/>
                </Link>
            <a href="/El_pulso_de_la_felicidad.csv" download>
                <img src="/images/icono4.png" alt="descargar csv" className="icono_tamaño"/>
                </a>
        </div>
    </div>
    );
}

export default MenuLateral;