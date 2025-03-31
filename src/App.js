import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function App() {
  const [resistance, setResistance] = useState('');
  const [temperature, setTemperature] = useState('');
  const [convertedTemp, setConvertedTemp] = useState(null);
  const [convertedResistance, setConvertedResistance] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const R0 = 100;
  const alpha = 0.00385;

  const convertToTemp = () => {
    const R = parseFloat(resistance);
    if (isNaN(R)) {
      setConvertedTemp('Entrée invalide');
      return;
    }
    const T = (R - R0) / (alpha * R0);
    setConvertedTemp(T.toFixed(2));
  };

  const convertToResistance = () => {
    const T = parseFloat(temperature);
    if (isNaN(T)) {
      setConvertedResistance('Entrée invalide');
      return;
    }
    const R = R0 * (1 + alpha * T);
    setConvertedResistance(R.toFixed(2));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const themeStyle = {
    backgroundColor: darkMode ? '#121212' : '#f9f9f9',
    color: darkMode ? '#f2f2f2' : '#121212',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    margin: '0 10px',
    padding: '0.3rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: darkMode ? '#333' : '#ddd',
    color: darkMode ? '#fff' : '#000'
  };

  // Générer des données pour le graphique
  const chartData = [];
  for (let t = 0; t <= 100; t += 5) {
    const R = R0 * (1 + alpha * t);
    chartData.push({ temperature: t, resistance: R });
  }

  return (
    <div style={themeStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h1>Convertisseur PT100</h1>
        <button onClick={toggleTheme} style={buttonStyle}>
          {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
        </button>
      </div>

      <section>
        <h2>🔁 Résistance → Température</h2>
        <p><code>T = (R - R₀) / (α × R₀)</code></p>
        <label>
          Résistance (Ω) :
          <input
            type="number"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button onClick={convertToTemp} style={buttonStyle}>Convertir en °C</button>
        {convertedTemp !== null && (
          <div>Température : <strong>{convertedTemp} °C</strong></div>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🔁 Température → Résistance</h2>
        <p><code>R = R₀ × (1 + α × T)</code></p>
        <label>
          Température (°C) :
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button onClick={convertToResistance} style={buttonStyle}>Convertir en Ω</button>
        {convertedResistance !== null && (
          <div>Résistance : <strong>{convertedResistance} Ω</strong></div>
        )}
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>📈 Courbe Température vs Résistance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="temperature" label={{ value: 'Température (°C)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Résistance (Ω)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="resistance" stroke={darkMode ? "#90ee90" : "#8884d8"} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

export default App;