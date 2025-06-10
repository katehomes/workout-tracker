import React, { useEffect, useState } from 'react';
import { createExercise, updateExercise, getExerciseById, type Exercise } from '../../api/exerciseApi';
import { MUSCLES, DIFFICULTIES } from '../../constants/exerciseConstants';

interface Props {
  closePanel: () => void;
  setDraft: (draft: Partial<Exercise> | null) => void;
  id?: string;
}


const CreateExercisePanel: React.FC<Props> = ({ closePanel, setDraft, id }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [media, setMedia] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<Exercise['difficulty']>('Easy');
  const [primaryMuscles, setPrimaryMuscles] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);

  useEffect(() => {
    setDraft({
      title,
      tags,
      steps,
      media,
      difficulty,
      primaryMuscles,
      secondaryMuscles
    });
  }, [id, title, tags, steps, media, difficulty, primaryMuscles, secondaryMuscles]);

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

  const addMedia = () => {
    setMedia([...media, { url: '', type: 'image', caption: '', side: 'both' }]);
  };

  const updateMedia = (i: number, field: string, value: string) => {
    const updated = [...media];
    updated[i][field] = value;
    setMedia(updated);
  };

  const toggleTag = (tag: string) => {
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const handleSaveEdit = () => {
    const exercise: Exercise = {
      title,  
      tags,
      steps,
      media,
      difficulty,
      primaryMuscles,
      secondaryMuscles
    };

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

      <div>
        <label className="block font-semibold mb-1">Media</label>
        {media.map((m, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <input
              className="border p-1 rounded col-span-2"
              value={m.url}
              onChange={(e) => updateMedia(i, 'url', e.target.value)}
              placeholder="Media URL"
            />
            <select
              className="border p-1 rounded"
              value={m.type}
              onChange={(e) => updateMedia(i, 'type', e.target.value)}
            >
              <option value="image">Image</option>
              <option value="gif">GIF</option>
              <option value="video">Video</option>
            </select>
            <select
              className="border p-1 rounded"
              value={m.side}
              onChange={(e) => updateMedia(i, 'side', e.target.value)}
            >
              <option value="both">Both</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <input
              className="border p-1 rounded col-span-4"
              value={m.caption}
              onChange={(e) => updateMedia(i, 'caption', e.target.value)}
              placeholder="Caption"
            />
          </div>
        ))}
        <button onClick={addMedia} className="text-sm text-blue-600">+ Add Media</button>
      </div>

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
