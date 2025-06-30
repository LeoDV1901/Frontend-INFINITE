import React from 'react';
import '../css/SignosV.css';

const ExploracionFisicaInicial = () => {
  return (
    <div className="container">
      <h3>Exploración Física Inicial</h3>
      <p>N: Normal &nbsp;&nbsp; A: Anormal</p>
      <table style={{ width: '100%', marginBottom: '20px' }} border="1">
        <thead>
          <tr>
            <th>Sistema</th>
            <th>N</th>
            <th>A</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Cabeza y cuello",
            "Oídos, nariz y garganta",
            "Tórax (corazón y pulmones)",
            "Extremidades superiores",
            "Abdomen",
            "Genitales",
            "Zona lumbar",
            "Extremidades inferiores"
          ].map((sistema, index) => (
            <tr key={index}>
              <td>{sistema}</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="text" placeholder="Comentarios" style={{ width: '100%' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ width: '100%', marginBottom: '20px' }} border="1">
  <thead>
    <tr>
      <th colSpan="3">Laboratorio VO (Basal)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colSpan="3">¿Se realizaron BH, QS y EGO?</td>
    </tr>
    <tr>
      <td>
        <label>
          <input type="radio" name="bh_qs_ego" value="si" /> Sí
        </label>
      </td>
      <td>
        <label>
          <input type="radio" name="bh_qs_ego" value="no" /> No
        </label>
      </td>
      <td>
        <input type="text" placeholder="¿Por qué?" style={{ width: '100%' }} />
      </td>
    </tr>
  </tbody>
</table>


      <h3>Resultados Exámenes de Laboratorio VO</h3>
      <table style={{ width: '100%' }} border="1">
        <thead>
          <tr>
            <th>Clínicamente Significativos</th>
            <th>No</th>
            <th>Sí</th>
            <th>¿Cuál(es) analito(s) y valor(es)?</th>
            <th>Acción Tomada<br /><small>*En caso de manejo farmacológico, anotar en Hoja de Medicamentos Concomitantes.</small></th>
          </tr>
        </thead>
        <tbody>
          {[
            "Biometría Hemática",
            "Química Sanguínea",
            "Examen General de Orina"
          ].map((examen, index) => (
            <tr key={index}>
              <td>{examen}</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td><input type="text" placeholder="Analito(s) y valor(es)" style={{ width: '100%' }} /></td>
              <td><input type="text" placeholder="Acción tomada" style={{ width: '100%' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit">Guardar</button>
    </div>
  );
};

export default ExploracionFisicaInicial;
