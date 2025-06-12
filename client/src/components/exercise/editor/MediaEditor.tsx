import React, { useEffect, useState } from 'react';
import { getExerciseById, type Exercise, type Media } from '../../../api/exerciseApi';
import MediaEditorItem from './MediaEditorItem';

interface Props {
  exerciseTitle: string;
  media: Media[];
  addMedia: (template?: string) => void;
  updateMedia: <K extends keyof Media>(i: number, field: K, value: Media[K]) => void
  demos: string[];
  diagrams: string[];
  heros: string[];
  toggleDemo: (demoId: string) => void;
  toggleDiagram: (diagId: string) => void;
  toggleHero: (diagId: string) => void;
}

export const getMediaTypeByTemplate = (template: string) => {
    switch (template) {
      case 'demo':
        return 'gif';
      case 'diagram':
        return 'image';
      case 'hero':
        return 'image';
      default:
        return 'image'
    }
}

const MediaEditor: React.FC<Props> = ({ 
    exerciseTitle, media, addMedia, updateMedia, demos, diagrams, heros, toggleDemo, toggleDiagram, toggleHero}) => {
    const[needs, setNeeds]= useState<string[]>([]);

    useEffect(() => {
      const newNeeds : string[] = [];
      if (demos.length < 1) newNeeds.push("demo");
      if (diagrams.length < 1) newNeeds.push("diagram");
      if (heros.length < 1) newNeeds.push("hero");
      setNeeds(newNeeds);
    }, [demos, diagrams, heros]);
  

  return (
    <div>
      <div className='flex justify-between'>
        <label className=" font-semibold mb-1">Media</label>
        {needs.length > 0 && (
          <span className='text-sm text-red-500'>
            {`*(Need one of${(needs.length > 1) ? " each" : ""}: ${needs.join(', ')})`}</span>
        )}
      </div>
        <div className="flex overflow-x-scroll gap-4 pb-4">
        {media.map((m, i) => (
          <MediaEditorItem 
            media={m} index={i} updateMedia={updateMedia} demos={demos} diagrams={diagrams} heros={heros}
            toggleDemo={toggleDemo} toggleDiagram={toggleDiagram} toggleHero={toggleHero}/>
        ))}
        </div>
        <button onClick={(e) => addMedia()} className="text-sm text-blue-600 mr-2">+ Blank Media</button>
        <button onClick={(e) => addMedia('demo')} className="text-sm text-blue-600 mr-2">+ Demo Template</button>
        <button onClick={(e) => addMedia('diagram')} className="text-sm text-blue-600 mr-2">+ Diagram Template</button>
        <button onClick={(e) => addMedia('hero')} className="text-sm text-blue-600 mr-2">+ Hero Template</button>
      </div>
  );
};

export default MediaEditor;
