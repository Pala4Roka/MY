import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from './components/ChatInterface';
import DossierList from './components/DossierList';
import DossierModal from './components/DossierModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [sessionId] = useState(() => uuidv4());
  const [publicObjects, setPublicObjects] = useState([]);
  const [classifiedObjects, setClassifiedObjects] = useState([]);
  const [hasAccessToClassified, setHasAccessToClassified] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicObjects();
  }, []);

  const fetchPublicObjects = async () => {
    try {
      const response = await axios.get(`${API}/scp/public`);
      setPublicObjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public objects:', error);
      setLoading(false);
    }
  };

  const fetchClassifiedObjects = async () => {
    try {
      const response = await axios.get(`${API}/scp/classified`);
      setClassifiedObjects(response.data);
      setHasAccessToClassified(true);
    } catch (error) {
      console.error('Error fetching classified objects:', error);
    }
  };

  const handleUnlockClassified = () => {
    fetchClassifiedObjects();
  };

  const handleObjectClick = (object) => {
    setSelectedObject(object);
  };

  const handleCloseModal = () => {
    setSelectedObject(null);
  };

  return (
    <div className="App">
      {/* Cursor Follower */}
      <CursorFollower />
      
      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1 className="title">ETERNAL SENTINELS DATABASE</h1>
          <p className="subtitle">Observe • Contain • Defend</p>
        </header>

        {/* Chat Interface */}
        <ChatInterface 
          sessionId={sessionId} 
          onUnlockClassified={handleUnlockClassified}
        />

        {/* Dossier List */}
        <div className="dossier-container">
          <DossierList 
            objects={[...publicObjects, ...(hasAccessToClassified ? classifiedObjects : [])]}
            onObjectClick={handleObjectClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedObject && (
        <DossierModal 
          object={selectedObject} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
