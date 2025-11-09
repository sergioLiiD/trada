import React from 'react';

interface PromptModalProps {
  onClose: () => void;
}

const PROMPT_TEXT = `
Crea una aplicación web de "Crypto Trading Journal" en un **único archivo HTML**. La aplicación debe usar **Tailwind CSS** para el estilo y **JavaScript** para toda la funcionalidad, incluyendo \`Chart.js\` para los gráficos. No debe haber archivos CSS o JS externos, excepto los enlaces CDN para Tailwind y Chart.js.

La aplicación debe tener un diseño de dos columnas en pantallas grandes (un formulario a la izquierda y el dashboard/log a la derecha).

**1. Columna Izquierda (Fija al hacer scroll):**

*   **Tarjeta "Capital Management":**
    *   Input "Initial Capital ($)".
    *   Input "Add Deposit ($)".
    *   Botón "Add Capital Deposit".
    *   Estos valores deben guardarse en \`localStorage\`.

*   **Tarjeta "Journaling Best Practices":**
    *   Una lista estática de consejos sobre trading.

*   **Tarjeta "Personal Notes":**
    *   Un título "Personal Notes".
    *   En la misma línea del título, botones de formato (Negrita, Itálica, Subrayado, Tachado) y 6 selectores de color (swatches) para cambiar el color de fondo de la tarjeta (incluyendo default, gris, rojo, verde, azul, amarillo).
    *   Un área de \`contenteditable\` para escribir notas.
    *   Un botón "Read More / Show Less" que aparece si el texto excede 3 líneas.
    *   Un texto "Further reading" en la esquina inferior derecha.
    *   El contenido de la nota, su formato (HTML) y el color de la tarjeta deben guardarse en \`localStorage\`.

*   **Tarjeta "Log a New Trade" (Formulario):**
    *   **Inputs:** Date & Time, Pair, Strategy, Direction (Long/Short), Risk/Reward (ej. "2:1"), Entry Price, Exit Price, **Margin ($) (manual)**, Leverage (Select 1x-100x), **Risk (%) (manual)**, **Fees ($) (manual)**.
    *   **Campos Auto-calculados (solo lectura):**
        1.  \`Position Value ($)\` = Margin * Leverage
        2.  \`Position Size (Asset)\` = Position Value / Entry Price
        3.  \`Risk ($)\` = Position Value * (Risk % / 100)
    *   Toda la lógica de auto-cálculo debe funcionar en tiempo real (\`oninput\`).
    *   Botón "Log Trade".

**2. Columna Derecha:**

*   **Tarjeta "Performance Dashboard":**
    *   Debe mostrar métricas clave calculadas a partir del log de trades:
    *   \`Current Capital\`: Calculado como (Initial Capital + Total Deposits + Total P/L).
    *   \`Total P/L ($)\`: Suma de todos los P/L netos.
    *   \`Win Rate\`: (Trades ganadores / Total Trades) %.
    *   \`Profit Factor\`: (Suma de P/L de trades ganadores / Suma de P/L de trades perdedores).
    *   Botón "Performance Analytics" que abre un modal.

*   **Tarjeta "Trade Log":**
    *   Una tabla que muestra todos los trades.
    *   **Columnas:** Date, Pair, Direction, Entry, Exit, Position Size, Leverage, Margin ($), R/R, Risk ($), Fees ($), **P/L ($) (Neto)**, **P/L % (Asset)**, **P/L % (Margin) (ROI)**, **Capital (End)**, Strategy.
    *   **Cálculos del Log (por operación):**
        *   \`P/L ($) (Neto)\`: (Exit - Entry) * Position Size * (Direction) - Fees
        *   \`P/L % (Asset)\`: (Exit - Entry) / Entry * (Direction)
        *   \`P/L % (Margin)\`: P/L ($) (Neto) / Margin ($)
        *   \`Capital (End)\`: Saldo de capital corriente después de cerrar la operación.
    *   Debe tener una **fila de Totales (\`<tfoot>\`)** que sume P/L ($), Fees ($), Risk ($) y Margin ($).
    *   Botón "Clear All Trades".

**3. Modales:**

*   **Modal "Performance Analytics":**
    *   Se abre desde el Dashboard.
    *   Debe mostrar 3 gráficos usando \`Chart.js\`:
        1.  **Equity Curve:** Un gráfico de línea que muestra \`Capital (End)\` después de cada trade, en orden cronológico.
        2.  **P/L Distribution:** Un gráfico de barras que muestra el \`P/L ($)\` de cada trade individual.
        3.  **Net Profit by Strategy:** Un **gráfico de barras horizontal** que muestra el P/L neto total para cada 'Strategy'. Las barras deben ser verdes para ganancias y rojas para pérdidas.

*   **Modal "Prompt de Creación" (Este mismo modal):**
    *   Un botón en el header principal ("Ver Prompt de Creación").
    *   Muestra un texto preformateado (este prompt) que explica cómo construir la app.

**4. Lógica de JavaScript (localStorage):**

*   Toda la aplicación debe usar \`localStorage\` para persistir datos.
*   **Claves de \`localStorage\`:**
    *   \`tradingJournal_trades_v3\`: Array de todos los objetos de trade.
    *   \`tradingJournal_capital_v3\`: Objeto con \`{ initial: 1000, deposits: 0 }\`.
    *   \`tradingJournal_note_v3\`: Objeto con \`{ content: "...", color: "..." }\`.
*   El P/L de los trades debe afectar el \`Current Capital\` en el dashboard.
*   El formulario de "Log a New Trade" debe auto-completar la fecha y hora actuales.
*   Todas las funciones (guardar, cargar, renderizar, calcular dashboard) deben estar bien organizadas y ejecutarse al cargar la página (\`DOMContentLoaded\`).
`;

const PromptModal: React.FC<PromptModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">Prompt de Creación de la App</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </header>
        <main className="p-6 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
            {PROMPT_TEXT.trim()}
          </pre>
        </main>
      </div>
    </div>
  );
};

export default PromptModal;