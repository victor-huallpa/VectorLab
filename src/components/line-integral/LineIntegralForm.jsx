import { useEffect, useState } from 'react';
import { ExpressionField, NumberField } from '../ui/NumberField.jsx';
import Toggle from '../ui/Toggle.jsx';
import Card, { CardHeader } from '../ui/Card.jsx';
import HelpIconButton from '../help/HelpIconButton.jsx';
import { validateExpression } from '../../utils/mathParser.js';
import { fetchLineIntegralPresets } from '../../services/lineIntegralService.js';

/**
 * Formulario del laboratorio de Integrales de Línea. Misma convención
 * visual que FieldForm.jsx (Card + CardHeader + campos controlados).
 *
 * Validación en vivo con el mismo patrón que FieldForm: validateExpression
 * (utils/mathParser.js) con el scope de variables que corresponde a cada
 * campo (x,y[,z] para el campo vectorial; t para la curva paramétrica).
 * Soporta 2D y 3D a través del toggle "Curva en 3D".
 */
export default function LineIntegralForm({ field, curve, config, onFieldChange, onCurveChange, onConfigChange, onLoadPreset }) {
  const is3D = config.is3D;
  const fieldScope = is3D ? { x: 1, y: 1, z: 1 } : { x: 1, y: 1 };
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    fetchLineIntegralPresets().then(setPresets);
  }, []);

  const pError = field.p.trim() ? validateExpression(field.p, fieldScope).error : null;
  const qError = field.q.trim() ? validateExpression(field.q, fieldScope).error : null;
  const rError = is3D && field.r.trim() ? validateExpression(field.r, fieldScope).error : null;

  const xError = curve.x.trim() ? validateExpression(curve.x, { t: 1 }).error : null;
  const yError = curve.y.trim() ? validateExpression(curve.y, { t: 1 }).error : null;
  const zError = is3D && curve.z.trim() ? validateExpression(curve.z, { t: 1 }).error : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Dimensión" description="Curva y campo en 2D o 3D" action={<HelpIconButton sectionId="que-es-integral-linea" />} />
        <div className="px-5 py-4">
          <Toggle label="Curva en 3D (usar z)" checked={is3D} onChange={(v) => onConfigChange({ is3D: v })} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Ejemplos" description="Casos resueltos para partir de una base conocida" />
        <div className="px-5 py-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-ink-muted">Elegir un ejemplo</span>
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
        <CardHeader
          title="Campo vectorial"
          description={is3D ? 'F(x, y, z) = P i + Q j + R k' : 'F(x, y) = P(x, y) i + Q(x, y) j'}
          action={<HelpIconButton sectionId="sintaxis" />}
        />
        <div className="space-y-3 px-5 py-4">
          <ExpressionField
            label={is3D ? 'P(x, y, z)' : 'P(x, y)'}
            value={field.p}
            onChange={(val) => onFieldChange({ p: val })}
            error={pError}
            placeholder="Ej: -y"
          />
          <ExpressionField
            label={is3D ? 'Q(x, y, z)' : 'Q(x, y)'}
            value={field.q}
            onChange={(val) => onFieldChange({ q: val })}
            error={qError}
            placeholder="Ej: x"
          />
          {is3D && (
            <ExpressionField
              label="R(x, y, z)"
              value={field.r}
              onChange={(val) => onFieldChange({ r: val })}
              error={rError}
              placeholder="Ej: z"
            />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Curva paramétrica"
          description={is3D ? 'x(t), y(t), z(t) para t ∈ [t0, t1]' : 'x(t), y(t) para t ∈ [t0, t1]'}
          action={<HelpIconButton sectionId="sintaxis" />}
        />
        <div className="space-y-3 px-5 py-4">
          <ExpressionField
            label="x(t)"
            value={curve.x}
            onChange={(val) => onCurveChange({ x: val })}
            error={xError}
            placeholder="Ej: cos(t)"
          />
          <ExpressionField
            label="y(t)"
            value={curve.y}
            onChange={(val) => onCurveChange({ y: val })}
            error={yError}
            placeholder="Ej: sin(t)"
          />
          {is3D && (
            <ExpressionField
              label="z(t)"
              value={curve.z}
              onChange={(val) => onCurveChange({ z: val })}
              error={zError}
              placeholder="Ej: t"
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="t0" value={curve.t0} onChange={(v) => onCurveChange({ t0: v })} step={0.1} />
            <NumberField label="t1" value={curve.t1} onChange={(v) => onCurveChange({ t1: v })} step={0.1} />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Visualización" action={<HelpIconButton sectionId="que-es-integral-linea" />} />
        <div className="space-y-4 px-5 py-4">
          <Toggle
            label="Mostrar campo vectorial de fondo"
            checked={config.showField}
            onChange={(v) => onConfigChange({ showField: v })}
          />
          <Toggle
            label="Mostrar orientación de la curva"
            checked={config.showOrientation}
            onChange={(v) => onConfigChange({ showOrientation: v })}
          />
        </div>
      </Card>
    </div>
  );
}
