import React, { useEffect, useState } from 'react';
import { createExercise, updateExercise, getExerciseById, type Exercise, type Media } from '../../api/exerciseApi';
import { MUSCLES, DIFFICULTIES } from '../../constants/exerciseConstants';
import MediaEditor, { getMediaTypeByTemplate } from './editor/MediaEditor';

interface Props {
  closePanel: () => void;
  setDraft: (draft: Partial<Exercise> | null) => void;
  id?: string;
}


const CreateExercisePanel: React.FC<Props> = ({ closePanel, setDraft, id }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [difficulty, setDifficulty] = useState<Exercise['difficulty']>('Easy');
  const [primaryMuscles, setPrimaryMuscles] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  
  const [media, setMedia] = useState<Exercise["media"]>([]);
  
  const [mediaMetadata, setMediaMetadata] = useState<Exercise["mediaMetadata"]>({
    demos: [], diagrams: [], heros: []
  });

  const [demos, setDemos] = useState<string[]>([]);
  const [heros, setHeros] = useState<string[]>([]);
  const [diagrams, setDiagrams] = useState<string[]>([]);

  useEffect(() => {
    // console.log("media", media);
    // console.log("demos", demos);
    // console.log("heros", heros);
    // console.log("diagrams", diagrams);
    setMediaMetadata({
      demos: demos, diagrams: diagrams, heros: heros
    });
  }, [demos, heros, diagrams])

  useEffect(() => {
    setDraft({
      title,
      tags,
      steps,
      media,
      difficulty,
      primaryMuscles,
      secondaryMuscles,
      mediaMetadata
    });
  }, [id, title, tags, steps, media, mediaMetadata, difficulty, primaryMuscles, secondaryMuscles]);

  useEffect(() => {
  if (!id) return;
    getExerciseById(id)
      .then((data) => {
        setTitle(data.title);
        setTags(data.tags || []);
        setSteps(data.steps || []);
        setMedia(data.media || []);
        setDifficulty(data.difficulty || 'Easy');
        setPrimaryMuscles(data.primaryMuscles || []);
        setSecondaryMuscles(data.secondaryMuscles || []);
      })
      .catch((err) => console.error('Failed to load workout:', err));
  },[id]);
  

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (i: number, value: string) => {
    const updated = [...steps];
    updated[i] = value;
    setSteps(updated);
  };

  const toggleMuscle = (muscle: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(muscle) ? list.filter(m => m !== muscle) : [...list, muscle]);
  };

  const addMedia = (template?: string) => {
    if(!template) {
      setMedia([...media, { url: '', type: 'image', caption: '', side: 'both' }]);
      return;
    }

    setMedia([...media, { url: '', type: `${getMediaTypeByTemplate(template)}`, caption: `${title} ${template}`, side: 'both' }]);
    switch (template) {
      case 'demo':
        setDemos([...demos, `${media.length}`]);
        break;
      case 'diagram':
        setDiagrams([...diagrams, `${media.length}`]);
        break;
      case 'hero':
        setHeros([...heros, `${media.length}`]);
        break;
      default:
        break;
    }
  };

  const updateMedia = <K extends keyof Media>(i: number, field: K, value: Media[K]) => {
    const updated = [...media];
    updated[i] = { ...updated[i], [field]: value };
    setMedia(updated);
  };

  const filterRemovedMediaMetatdata = (arrToUpdate: string[], indexToRemove: number) => {
    return arrToUpdate.filter(stringIdx => stringIdx !== indexToRemove.toString())
      .map(demoIdx => {
        const stringIdxNum: number = Number(demoIdx);

        if(stringIdxNum < indexToRemove) return demoIdx;

        return (stringIdxNum - 1).toString();
      })
  }

  const removeMedia = (indexToRemove: number) => {

    setDemos(filterRemovedMediaMetatdata(demos, indexToRemove));
    setDiagrams(filterRemovedMediaMetatdata(diagrams, indexToRemove));
    setHeros(filterRemovedMediaMetatdata(heros, indexToRemove));
    
    const newMedia = media;
    newMedia.splice(indexToRemove, 1);
    setMedia(newMedia);
  };


  const toggleTag = (tag: string) => {
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const toggleDemo = (demoId: string) => {
    setDemos(demos.includes(demoId) ? demos.filter(dId => dId !== demoId) : [...demos, demoId]);
  };

  const toggleHero = (heroId: string) => {
    setHeros(heros.includes(heroId) ? heros.filter(hId => hId !== heroId) : [...heros, heroId]);
  };

  const toggleDiagram = (diagId: string) => {
    setDiagrams(diagrams.includes(diagId) ? diagrams.filter(dId => dId !== diagId) : [...diagrams, diagId]);
  };

  const handleSaveEdit = () => {
    console.log("mediaMetadata", mediaMetadata);
    const exercise: Exercise = {
      title,  
      tags,
      steps,
      media,
      mediaMetadata,
      difficulty,
      primaryMuscles,
      secondaryMuscles
    };

    console.log("exToSave", exercise );

    if(id) {
      updateExercise(id, exercise)
        .then(() => {
          setDraft(null);
          closePanel();
        })
        .catch(console.error);
    } else {
      createExercise(exercise)
        .then(() => {
          setDraft(null);
          closePanel();
        })
        .catch(console.error);
    }
  };
    

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={closePanel} className="text-gray-500 hover:text-gray-800">
            &times; Close
        </button>
        <button
          onClick={handleSaveEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >{id ? ('Edit') : ('Save New')}
        </button>
      </div>
      <h2 className="text-2xl font-bold">{id ? ('Edit') : ('Create New')} Exercise</h2>

      <input
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Exercise title (required)"
      />

      <div>
        <label className="block font-semibold mb-1">Tags</label>
        <input
          className="w-full border p-2 rounded"
          value={tags.join(', ')}
          onChange={(e) => {setTags(e.target.value.split(',').map(t => t.trim()))} }
          placeholder="e.g. mat, resistance band, dumbbells"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Steps</label>
        {steps.map((step, i) => (
          <input
            key={i}
            className="w-full border p-2 mb-2 rounded"
            value={step}
            onChange={(e) => updateStep(i, e.target.value)}
            placeholder={`Step ${i + 1}`}
          />
        ))}
        <button onClick={addStep} className="text-sm text-blue-600">+ Add Step</button>
      </div>

      <MediaEditor media={media} addMedia={addMedia} updateMedia={updateMedia} removeMedia={removeMedia}
        exerciseTitle={title} demos={demos} diagrams={diagrams} heros={heros}   
        toggleDemo={toggleDemo} toggleDiagram={toggleDiagram} toggleHero={toggleHero}
      />

      <div>
        <label className="block font-semibold mb-1">Difficulty</label>
        <select
          className="w-full border p-2 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Exercise['difficulty'])}
        >
          <option value="">Select difficulty</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Primary Muscles</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLES.map((m) => (
            <button
              key={m}
              className={`px-3 py-1 rounded-full border ${primaryMuscles.includes(m) ? 'bg-green-200' : 'bg-white'}`}
              onClick={() => {
                toggleMuscle(m, primaryMuscles, setPrimaryMuscles);
                toggleTag(m.toLowerCase());
              }}
            >{m}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Secondary Muscles (optional)</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLES.map((m) => (
            <button
              key={m}
              className={`px-3 py-1 rounded-full border ${secondaryMuscles.includes(m) ? 'bg-yellow-200' : 'bg-white'}`}
              onClick={() => {
                toggleMuscle(m, secondaryMuscles, setSecondaryMuscles);
                toggleTag(m.toLowerCase());

              }}
            >{m}</button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CreateExercisePanel;
