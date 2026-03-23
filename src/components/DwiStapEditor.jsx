import { useState } from 'react'
import {
  GripVertical,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Image,
} from 'lucide-react'

export default function DwiStapEditor({ stap, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [collapsed, setCollapsed] = useState(false)

  function updateField(field, value) {
    onChange({ ...stap, [field]: value })
  }

  function updateSubstap(i, value) {
    const subs = [...(stap.substappen || [])]
    subs[i] = value
    updateField('substappen', subs)
  }

  function addSubstap() {
    updateField('substappen', [...(stap.substappen || []), ''])
  }

  function removeSubstap(i) {
    const subs = [...(stap.substappen || [])]
    subs.splice(i, 1)
    updateField('substappen', subs)
  }

  function updateBijschrift(i, value) {
    const captions = [...(stap.bijschrift || [])]
    captions[i] = value
    updateField('bijschrift', captions)
  }

  function removeAfbeelding(i) {
    const imgs = [...(stap.afbeeldingen || [])]
    const capts = [...(stap.bijschrift || [])]
    imgs.splice(i, 1)
    capts.splice(i, 1)
    updateField('afbeeldingen', imgs)
    onChange({ ...stap, afbeeldingen: imgs, bijschrift: capts })
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
      {/* Header — always visible */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-t-xl border-b border-gray-200">
        <GripVertical className="w-4 h-4 text-gray-400 shrink-0 cursor-grab" />
        <div className="w-8 h-8 rounded-full bg-thg-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
          {stap.nummer}
        </div>
        <input
          type="text"
          value={stap.titel || ''}
          onChange={(e) => updateField('titel', e.target.value)}
          placeholder="Stap titel..."
          className="flex-1 font-semibold text-sm bg-transparent border-0 focus:ring-0 focus:outline-none
            placeholder-gray-400 min-w-0"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Omhoog">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={isLast}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            title="Omlaag">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title={collapsed ? 'Uitklappen' : 'Inklappen'}>
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button onClick={onRemove}
            className="p-1 text-red-400 hover:text-red-600"
            title="Verwijder stap">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body — collapsible */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Beschrijving */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Beschrijving</label>
            <textarea
              value={stap.beschrijving || ''}
              onChange={(e) => updateField('beschrijving', e.target.value)}
              placeholder="Wat moet de operator doen..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm
                focus:ring-2 focus:ring-thg-accent focus:border-thg-accent resize-y"
            />
          </div>

          {/* Foto's */}
          {stap.afbeeldingen && stap.afbeeldingen.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                <Image className="w-3 h-3 inline mr-1" />
                Foto's ({stap.afbeeldingen.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stap.afbeeldingen.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Stap ${stap.nummer} foto ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removeAfbeelding(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5
                        opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Foto verwijderen"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      value={stap.bijschrift?.[i] || ''}
                      onChange={(e) => updateBijschrift(i, e.target.value)}
                      placeholder="Bijschrift..."
                      className="w-full mt-1 border border-gray-200 rounded px-2 py-1 text-xs
                        focus:ring-1 focus:ring-thg-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Substappen */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500">Substappen</label>
              <button onClick={addSubstap}
                className="text-xs text-thg-accent hover:text-thg-blue flex items-center gap-1">
                <Plus className="w-3 h-3" /> Toevoegen
              </button>
            </div>
            {(stap.substappen || []).map((sub, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-thg-blue flex items-center
                  justify-center text-xs font-semibold shrink-0">
                  {String.fromCharCode(97 + i)}
                </span>
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => updateSubstap(i, e.target.value)}
                  placeholder="Substap beschrijving..."
                  className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm
                    focus:ring-1 focus:ring-thg-accent"
                />
                <button onClick={() => removeSubstap(i)}
                  className="text-red-400 hover:text-red-600 p-0.5">
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Waarschuwing */}
          <div>
            <label className="block text-xs font-medium text-orange-600 mb-1">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Waarschuwing (optioneel)
            </label>
            <textarea
              value={stap.waarschuwing || ''}
              onChange={(e) => updateField('waarschuwing', e.target.value || null)}
              placeholder="Veiligheidswaarschuwing..."
              rows={1}
              className="w-full border border-orange-200 rounded-lg py-2 px-3 text-sm bg-orange-50
                focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-y"
            />
          </div>

          {/* Tip */}
          <div>
            <label className="block text-xs font-medium text-green-600 mb-1">
              <Lightbulb className="w-3 h-3 inline mr-1" />
              Tip (optioneel)
            </label>
            <textarea
              value={stap.tip || ''}
              onChange={(e) => updateField('tip', e.target.value || null)}
              placeholder="Handige tip..."
              rows={1}
              className="w-full border border-green-200 rounded-lg py-2 px-3 text-sm bg-green-50
                focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  )
}
