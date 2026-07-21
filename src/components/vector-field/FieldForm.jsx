import { useEffect, useState } from 'react';
import { ExpressionField, NumberField } from '../ui/NumberField.jsx';
import Slider from '../ui/Slider.jsx';
import Toggle from '../ui/Toggle.jsx';
import Card, { CardHeader } from '../ui/Card.jsx';
import HelpIconButton from '../help/HelpIconButton.jsx';
import { validateExpression } from '../../utils/mathParser.js';
import { fetchFieldPresets } from '../../services/vectorFieldService.js';

export default function FieldForm({ p, q, config, onExpressionsChange, onConfigChange, onDomainChange, onLoadPreset }) {
  const [presets, setPresets] = useState([]);
  const pError = validateExpression(p).error;
  const qError = validateExpression(q).error;

  useEffect(() => {
    fetchFieldPresets().then(setPresets);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Funciones del campo"
          description="F(x, y) = P(x, y) i + Q(x, y) j"
          action={<HelpIconButton sectionId="sintaxis" />}
        />
        <div className="space-y-3 px-5 py-4">
          <ExpressionField
            label="P(x, y)"
            value={p}
            onChange={(val) => onExpressionsChange(val, q)}
            error={p.trim() ? pError : null}
            placeholder="Ej: -y"
          />
          <ExpressionField
            label="Q(x, y)"
            value={q}
            onChange={(val) => onExpressionsChange(p, val)}
            error={q.trim() ? qError : null}
            placeholder="Ej: x"
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">Campos de ejemplo</span>
            <select
              className="h-9 rounded-lg border border-border bg-surface-sunken px-3 text-sm text-ink outline-none focus:border-accent"
              defaultValue=""
              onChange={(e) => {
                const preset = presets.find((item) => item.id === e.target.value);
                if (preset) onLoadPreset(preset);
                e.target.value = '';
              }}
            >
              <option value="" disabled>
                Elegir un ejemplo…
              </option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dominio" description="Región del plano a visualizar" action={<HelpIconButton sectionId="dominio" />} />
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          <NumberField label="xmin" value={config.domain.xmin} onChange={(v) => onDomainChange({ xmin: v })} />
          <NumberField label="xmax" value={config.domain.xmax} onChange={(v) => onDomainChange({ xmax: v })} />
          <NumberField label="ymin" value={config.domain.ymin} onChange={(v) => onDomainChange({ ymin: v })} />
          <NumberField label="ymax" value={config.domain.ymax} onChange={(v) => onDomainChange({ ymax: v })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Visualización" action={<HelpIconButton sectionId="visualizacion" />} />
        <div className="space-y-4 px-5 py-4">
          <Slider
            label="Densidad de vectores"
            value={config.density}
            onChange={(v) => onConfigChange({ density: v })}
            min={5}
            max={40}
          />
          <Slider
            label="Escala de flechas"
            value={config.scale}
            onChange={(v) => onConfigChange({ scale: v })}
            min={0.1}
            max={3}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
            unit="×"
          />
          <Toggle
            label="Colorear por magnitud"
            checked={config.colorByMagnitude}
            onChange={(v) => onConfigChange({ colorByMagnitude: v })}
          />
          <Toggle
            label="Simulación de partículas"
            checked={config.showParticles}
            onChange={(v) => onConfigChange({ showParticles: v })}
          />
        </div>
      </Card>
    </div>
  );
}
