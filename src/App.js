import React, {useState, useEffect} from 'react';
import './App.css';

import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';

const App = () => {
	const [model, setModel] = useState(null);
	const [action, setAction] = useState(null);
	const [labels, setLabels] = useState(null);

	//Recognizer
	const loadModel = async ()=>{
		const recognizer = await speech.create("BROWSER_FFT");
		console.log("Model has been loaded");
		await recognizer.ensureModelLoaded();
		console.log(recognizer.wordLabels());
		setModel(recognizer);
		setLabels(recognizer.wordLabels());
	}

	useEffect(()=>{
		loadModel()
	},[]);


	function argMax(arr){
		return arr.map((x,i)=>[x, i]).reduce((r,a)=>(a[0] < r[0] ? a:r))[1];
	}



	const recognizeCommands = async ()=>{
		console.log("Listening for commands");
		model.listen(result =>{
			console.log(result);
			setAction(labels[argMax(Object.values(result.scores))]);
			console.log(action);
		},{includeSpectrogram: true, probabilityThreshold: 0.7})
		setTimeout(()=> model.stopListening(), 1000)
	}







  return (
    <div className="App">
	<button onClick={recognizeCommands}>Command</button>
	{
		action ? <div>{action}</div> : <div>No command detected</div>
	}
      
    </div>
  );
}

export default App;
