import React from 'react';
import { useNavigate } from 'react-router-dom';
import { titleToSlug } from '../presets';
import { presets } from '../presets';

export function PresetDropdown({ label, selected = '' }: { label?: string, selected?: string }) {
  const navigate = useNavigate();

  function handleChange(event: any) {
    event.preventDefault();
    const presetTitle = event.target.value;
    if (presetTitle) {
      const slug = titleToSlug(presetTitle as string);
      navigate(`/p/${slug}`);
    }
  }

  // if the current selected config isn't in the preset list,
  // we're looking at a local file -- don't list the presets
  // (this is a hacky place for this logic but we're going with it for now)
  return selected.length && !presets[selected] ? <></> :
    <>
      <label htmlFor="presetDropdown">{label}</label>
      <select id="presetDropdown" name="presetTitle" defaultValue={selected} onChange={handleChange}>
        <option></option>
        {Object.keys(presets).map(presetTitle => <option key={presetTitle} value={presetTitle}>{presetTitle}</option>)}
      </select>
    </>
}
