import React from 'react';
import { useNavigate } from 'react-router-dom';
import { titleToSlug } from './presets';
import { presets } from './presets';

export function PresetDropdown({ label = '' }: { label: string }) {
  const navigate = useNavigate();

  function handleChange(event: any) {
    event.preventDefault();
    const presetTitle = event.target.value;
    if (presetTitle) {
      const slug = titleToSlug(presetTitle as string);
      navigate(`p/${slug}`);
    }
  }

  return (<>
      <label htmlFor="presetDropdown">{label}</label>
      <select id="presetDropdown" name="presetTitle" defaultValue="" onChange={handleChange}>
        <option></option>
        {Object.keys(presets).map(presetTitle => <option key={presetTitle} value={presetTitle}>{presetTitle}</option>)}
      </select>
  </>);
}
