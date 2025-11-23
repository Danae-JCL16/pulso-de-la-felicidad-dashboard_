import React from "react";
import { Link } from "react-router-dom";
import "./MenuLateral.css";

function MenuLateral() {
    return (
    <div className="menu_dashboard">
        <div className="iconos">
            <Link to="/">
                <img src="https://github.com/Danae-JCL16/pulso-de-la-felicidad-dashboard_/blob/main/public/icono1.PNG" alt="Inicio" className="icono_tamaño" />
                </Link>
            <Link to="/mapa">
                <img src="/icono2.png" alt="Mapa mundial" className="icono_tamaño"/>
                </Link>
            <Link to="/social">
                <img src="/icono3.png" alt="Bienestar social" className="icono_tamaño"/>
                </Link>
            <a href="/El_pulso_de_la_felicidad.csv" download>
                <img src="/icono4.png" alt="descargar csv" className="icono_tamaño"/>
                </a>
        </div>
    </div>
    );
}

export default MenuLateral;