import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiSave } from 'react-icons/fi';

const FALLBACK_IMG = '/images/resource-placeholder.svg';

function FieldInput({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <textarea
        rows={field.rows || 3}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-root"
        placeholder={field.placeholder}
      />
    );
  }
  if (field.type === 'tags') {
    const text = Array.isArray(value) ? value.join(', ') : '';
    return (
      <input
        value={text}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        className="input-root"
        placeholder={field.placeholder || 'Éléments séparés par des virgules'}
      />
    );
  }
  if (field.type === 'select') {
    return (
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="input-root">
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  if (field.type === 'image') {
    return (
      <div className="space-y-3">
        <input
          type="url"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-root"
          placeholder="https://.../image.png"
        />
        {value ? (
          <div className="relative h-32 overflow-hidden bg-gray2 dark:bg-[#2C303B]">
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <input
      type={field.type || 'text'}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-root"
      placeholder={field.placeholder}
    />
  );
}

export default function AdminListEditor({
  items = [],
  onChange,
  fields = [],
  newItem = {},
  titleKey = 'title',
  addLabel = 'Ajouter',
  onSaveItem,
  onRemoveItem,
  hideAdd = false,
}) {
  const [openId, setOpenId] = useState(null);

  const update = (id, patch) => onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id) => onChange(items.filter((it) => it.id !== id));
  const add = () => onChange([{ ...newItem, id: `local-${Date.now()}` }, ...items]);

  const handleRemove = async (item) => {
    if (typeof onRemoveItem === 'function') {
      const ok = await onRemoveItem(item);
      if (ok) remove(item.id);
      return;
    }
    remove(item.id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="card-root overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-stroke/70 dark:border-[#2C303B]">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                {isOpen ? (
                  <FiChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="text-sm font-bold text-dark dark:text-white truncate">
                  {item[titleKey] || 'Nouvel élément'}
                </span>
              </button>
              {onSaveItem && (
                <button
                  type="button"
                  onClick={() => onSaveItem(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  <FiSave className="w-3.5 h-3.5" /> Enregistrer
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                aria-label="Supprimer"
                className="h-9 w-9 flex-shrink-0 bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
            {isOpen && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map((field) => (
                  <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                    <label className="label-root mb-2">{field.label}</label>
                    <FieldInput field={field} value={item[field.key]} onChange={(v) => update(item.id, { [field.key]: v })} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {!hideAdd && (
        <button type="button" onClick={add} className="btn-outline-root w-full">
          <FiPlus className="w-4 h-4" /> {addLabel}
        </button>
      )}
    </div>
  );
}