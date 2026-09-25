import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown, FiSave } from 'react-icons/fi';
import { useLang } from '../../i18n/LanguageContext';

const FALLBACK_IMG = '/images/resource-placeholder.svg';
const createLocalId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function FieldInput({ field, value, onChange }) {
  const { t } = useLang();
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
        placeholder={field.placeholder || t('admin.editor.tagsPlaceholder')}
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
              alt={t('common.preview')}
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
  addLabel = '',
  onSaveItem,
  onRemoveItem,
  onReorder,
  reorderable = false,
  addAtEnd = false,
  hideAdd = false,
}) {
  const [openId, setOpenId] = useState(null);
  const { t } = useLang();

  const update = (idx, patch) => onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const add = () => {
    const item = {
      ...newItem,
      id: createLocalId(),
      ...(reorderable ? { sortOrder: addAtEnd ? items.length + 1 : 1 } : {}),
    };
    onChange(addAtEnd ? [...items, item] : [item, ...items]);
  };

  const handleRemove = async (item, idx) => {
    if (typeof onRemoveItem === 'function') {
      const ok = await onRemoveItem(item);
      if (ok) remove(idx);
      return;
    }
    remove(idx);
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const itemId = item.id ?? `idx-${idx}`;
        const itemTitle = item[titleKey] || t('admin.editor.newItem');
        const isOpen = openId === itemId;
        return (
          <div key={itemId} className="card-root overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-stroke/70 dark:border-[#2C303B]">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : itemId)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                {isOpen ? (
                  <FiChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="text-sm font-bold text-dark dark:text-white truncate">{itemTitle}</span>
              </button>
              {reorderable && onReorder && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className="min-w-8 text-center text-xs font-bold text-body dark:text-body-dark"
                    aria-label={`${t('admin.editor.position')} ${idx + 1}`}
                  >
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onReorder(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`${t('admin.editor.moveUp')}: ${itemTitle}`}
                    title={t('admin.editor.moveUp')}
                    className="h-9 w-9 bg-gray2 dark:bg-[#2C303B] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorder(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label={`${t('admin.editor.moveDown')}: ${itemTitle}`}
                    title={t('admin.editor.moveDown')}
                    className="h-9 w-9 bg-gray2 dark:bg-[#2C303B] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              {onSaveItem && (
                <button
                  type="button"
                  onClick={() => onSaveItem(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  <FiSave className="w-3.5 h-3.5" /> {t('admin.editor.save')}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item, idx)}
                aria-label={t('admin.editor.deleteAria')}
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
                    <FieldInput field={field} value={item[field.key]} onChange={(v) => update(idx, { [field.key]: v })} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {!hideAdd && (
        <button type="button" onClick={add} className="btn-outline-root w-full">
          <FiPlus className="w-4 h-4" /> {addLabel || t('common.add')}
        </button>
      )}
    </div>
  );
}