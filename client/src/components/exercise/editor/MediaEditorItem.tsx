import React, { useEffect, useState } from 'react';
import { type Media } from '../../../api/exerciseApi';

interface Props {
    index: number;
    media: Media;
    updateMedia: <K extends keyof Media>(i: number, field: K, value: Media[K]) => void
    demos: string[];
    diagrams: string[];
    heros: string[];
    toggleDemo: (demoId: string) => void;
    toggleDiagram: (diagId: string) => void;
    toggleHero: (diagId: string) => void;
}

const addOrRemoveIdx = (mediaIdxArr: string[], mediaArrAlias: string, targetArrAlias: string, mediaIdx: string, callback: () => void) => {
        if((mediaIdxArr.includes(mediaIdx) && mediaArrAlias != targetArrAlias) || //in array, and should not be
            (!mediaIdxArr.includes(mediaIdx) && mediaArrAlias == targetArrAlias)) //not in array, and should be
        {
            callback();
        }
};

const MediaEditorItem: React.FC<Props> = ({ index, media, updateMedia, demos, diagrams, heros, toggleDemo, toggleDiagram, toggleHero}) => {

    const handleRadioChange = (targetArrAlias: string, targetIdx: string) => {

        addOrRemoveIdx(demos, 'demo', targetArrAlias, targetIdx, () => toggleDemo(targetIdx));

        addOrRemoveIdx(diagrams, 'diagram', targetArrAlias, targetIdx, () => toggleDiagram(targetIdx));

        addOrRemoveIdx(heros, 'hero', targetArrAlias, targetIdx, () => toggleHero(targetIdx)); 
    };

    

  return (
    <div key={index} className={`grid grid-cols-4 gap-2 mb-2 w-[350px] bg-blue-100 rounded-lg shadow p-4`}>
        <input
            className="border p-1 rounded col-span-4"
            value={media.url}
            onChange={(e) => updateMedia(index, 'url', e.target.value)}
            placeholder="Media URL"
        />
        <input
            className="border p-1 rounded col-span-4"
            value={media.caption}
            onChange={(e) => updateMedia(index, 'caption', e.target.value)}
            placeholder="Caption"
        />
        <div className='col-span-2 grid grid-cols-2 '>
            <label>Type:</label>
            <select
                className="border p-1 rounded w-full"
                value={media.type}
                onChange={(e) => updateMedia(index, 'type', e.target.value as Media['type'])}
            >
            <option value="image">Image</option>
            <option value="gif">GIF</option>
            <option value="video">Video</option>
            </select>
        </div>
        <div className='col-span-2 grid grid-cols-2 '>
            <label>Side:</label>
            <select
                className="border p-1 rounded"
                value={media.side}
                onChange={(e) => updateMedia(index, 'side', e.target.value as Media['side'])}
            >
            <option value="both">Both</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            </select>
        </div>
        {/* <div className='col-span-4 grid grid-cols-3'>
            <div className='col-span-1 grid grid-rows-2 border justify-center'>
                <label>Demo:</label>
                <input
                    type="checkbox"
                    checked={true}
                    onChange={(e) => {
                    
                    }}
                    className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
            </div>
            <div className='col-span-1 grid grid-rows-2 border justify-center'>
                <div>Hero:</div>
                <input
                    type="checkbox"
                    checked={true}
                    onChange={(e) => {
                    
                    }}
                    className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
            </div>
            <div className='col-span-1 grid grid-rows-2 border justify-center'>
                <label>Diagram:</label>
                <input
                    type="checkbox"
                    checked={diagrams.includes(media._id!)}
                    onChange={(e) => { toggleDiagram(media._id!);}}
                    className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
            </div>
        </div> */}
        <div className='col-span-4'>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                        <input type="radio" value="demo" name={`list-radio-${index}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={demos.includes(index.toString())}
                            onChange={(e) => handleRadioChange(e.target.value, index.toString())}
                        />
                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Demo</label>
                    </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div className="flex items-center ps-3">
                        <input type="radio" value="diagram" name={`list-radio-${index}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={diagrams.includes(index.toString())}
                            onChange={(e) => handleRadioChange(e.target.value, index.toString())}
                        />
                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Diagram</label>
                    </div>
                </li>
                <li className="w-full dark:border-gray-600">
                    <div className="flex items-center ps-3">
                        <input type="radio" value="hero" name={`list-radio-${index}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={heros.includes(index.toString())} 
                            onChange={(e) => handleRadioChange(e.target.value, index.toString())}
                        />
                        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hero</label>
                    </div>
                </li>
            </ul>
        </div>
        
    </div>
  );
};

export default MediaEditorItem;
