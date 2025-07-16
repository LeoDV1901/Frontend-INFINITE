import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import FormularioEvaluacionI from "./components/Formularios/Criterios_exclusion";
import FormularioEvaluacionE from "./components/Formularios/Criterios_inclusion";
import FormularioMedico from "./components/Formularios/Signos Vitales";
import TablaProcedimientos from "./components/Cronograma";
import ExploracionFisicaInicial from "./components/Formularios/ExploracionFisicaInicial";
import HistoriaClinica from "./components/Formularios/HistoriaClinica";
import ConcentimientoInformado from "./components/Formularios/FormatoConcentimiento";
import DiarioPacienteIntro from "./components/IntroDiarioPaciente";
import AvisoDePrivacidad from "./components/AvisoPrivacidad";
import InstruccionesDiario from "./components/InstruccionesDiario";
import PreguntaInicio from "./components/PreguntaInicio";
import DiarioPacienteFecha from "./components/HorarioCita";
import EvaluacionTratamiento from "./components/EvaluacionTratamiento";
import RegistroPaciente from "./components/RegistroPacientes";
import VistaPacientes from "./components/Index";
import SignosVitalesGraph from "./components/Graficas";
import MedicamentosConcomitantes from "./components/Formularios/MedicamentosConcomitantes";
import EventosAdversos from "./components/Formularios/MedicamentosAdvesos";
import SplashScreen from "./components/Presentacion";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
    <Route path="/Login" element={<Login /> }/>
    <Route path="/CriteriosI/:idPaciente" element={<FormularioEvaluacionI />} />
    <Route path="/CriteriosE/:idPaciente" element={<FormularioEvaluacionE />} />
    <Route path="/Signos_Vitales/:idPaciente" element={<FormularioMedico />} />
    <Route path="/Cronograma/:idPaciente" element={<TablaProcedimientos />} />
    <Route path="/HistoriaClinica/:idPaciente" element={<HistoriaClinica />} />
    <Route path="/ExploracionFisicaInicial" element={<ExploracionFisicaInicial />} />
    <Route path="/ConcentimientoInformado/:idPaciente" element={<ConcentimientoInformado />} />
    <Route path="/IntroDiarioPaciente" element={<DiarioPacienteIntro />} />
    <Route path="/AvisodePrivacidad" element={<AvisoDePrivacidad />} />
    <Route path="/InstruccionesDiario" element={<InstruccionesDiario />} />
    <Route path="/PreguntaInicio" element={<PreguntaInicio />} />
    <Route path="/FechaDiarioPaciente" element={<DiarioPacienteFecha />} />
    <Route path="/EvaluacionTratamiento" element={<EvaluacionTratamiento />} />
    <Route path="/RegistroPacientes" element={<RegistroPaciente />} />
    <Route path="/Index" element={<VistaPacientes />} />
    <Route path="/Graficas" element={<SignosVitalesGraph />} />
    <Route path="/MedicamentosConcomitantes/:idPaciente" element={<MedicamentosConcomitantes />} />
    <Route path="/EventosAdversos/:idPaciente" element={<EventosAdversos />} />
    <Route path="/" element={<SplashScreen />} />
    </Routes>
  </BrowserRouter>
)