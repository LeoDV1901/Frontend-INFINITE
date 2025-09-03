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
import UploadForm from "./components/Archivos";
import Protocolo from "./components/Protocolo";
import ReportePaciente from "./components/Reporte";
import CrearAdministrador from "./components/CrearAdministrador";
import PrivateRoute from "./PrivateRoute";
import CriteriosEliminacion from "./components/Formularios/Criterios_eliminacion";
import HistoriaClinicaGraphs from "./components/Graficas_HistoriaClinica";
import ConsentimientoForm from "./components/Exel_Concentimiento";
import CriteriosInclusionForm from "./components/Exel_Inclusion";
import CriteriosExclusionForm from "./components/Exel_Exclusion";
import CriteriosEliminacionForm from "./components/Exel_Eliminacion";
import HistoriaClinicaForm from "./components/Exel_HClinica";
import SignosForm from "./components/Exel_Signos";
import MedicamentosConconmitantesForm from "./components/Exel_Concomitantes";
import EventosAdversosForm from "./components/Exel_Adversos";
import RutasExels from "./components/Control_Exel";
import RutasGraficas from "./components/Control_Graficas";
import MedicamentosGraph from "./components/Graficas_MConcomitantes";
import EventosAdversosGraph from "./components/Graficas_adversos";

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
    <Route path="/Index" element={<PrivateRoute element={<VistaPacientes />} />} />

    <Route path="/Graficas" element={<SignosVitalesGraph />} />
    <Route path="/MedicamentosConcomitantes/:idPaciente" element={<MedicamentosConcomitantes />} />
    <Route path="/EventosAdversos/:idPaciente" element={<EventosAdversos />} />
    <Route path="/" element={<SplashScreen />} />
    <Route path="/Archivos/:idPaciente" element={<UploadForm />} />
    <Route path="/Protocolo" element={<Protocolo />} />
    <Route path="/ReportePaciente/:idPaciente" element={<ReportePaciente />} />
    <Route path="/CreateAdmin" element={<CrearAdministrador />} />
    <Route path="/CriteriosEliminacion/:idPaciente" element={<CriteriosEliminacion />} />

    <Route path="/GraficasHistoriaClinica" element={<HistoriaClinicaGraphs />} />
    <Route path="/ExelConcentimiento" element={<ConsentimientoForm />} />
    <Route path="/Exel_Inclusion" element={<CriteriosInclusionForm />} />
    <Route path="/Exel_Exclusion" element={<CriteriosExclusionForm />} />
    <Route path="/Exel_Eliminacion" element={<CriteriosEliminacionForm />} />
    <Route path="/Exel_HClinica" element={<HistoriaClinicaForm />} />
    <Route path="/Exel_Signos" element={<SignosForm />} />
    <Route path="/Exel_Concomitantes" element={<MedicamentosConconmitantesForm />} />
    <Route path="/Exel_Adversos" element={<EventosAdversosForm />} />
    <Route path="/Routes_view" element={<RutasExels/>} />
    <Route path="/Routes_graficas" element={<RutasGraficas/>} />
    <Route path="/Graficas_Concomitantes" element={<MedicamentosGraph/>} />
    <Route path="/Graficas_Eventos" element={<EventosAdversosGraph/>} />

    
    </Routes>
  </BrowserRouter>
)