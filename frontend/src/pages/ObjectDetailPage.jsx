import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, Shield, AlertTriangle, FileText, Lock } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ObjectDetailPage = () => {
  const { objectId } = useParams();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObjectDetail();
  }, [objectId]);

  const fetchObjectDetail = async () => {
    try {
      const response = await axios.get(`${API}/objects/${objectId}`);
      setObject(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching object detail:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Объект не найден</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Вернуться к базе данных
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-red-600">Eternal Sentinels</h1>
                <p className="text-xs text-gray-400">Observe • Contain • Defend</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg transition-colors border border-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Назад к базе данных</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Object Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 md:p-8 border border-red-900/30 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {object.image_url && (
              <div className="md:w-1/3">
                <div className="bg-black/50 rounded-lg p-4 border border-red-900/30">
                  <img
                    src={object.image_url}
                    alt={object.name}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}
            
            <div className={object.image_url ? "md:w-2/3" : "w-full"}>
              <p className="text-red-400 font-mono text-sm mb-2">{object.number}</p>
              <h1 className="text-4xl font-bold mb-2 text-white">{object.name}</h1>
              <p className="text-xl text-gray-400 italic mb-4">"{object.codename}"</p>
              
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3 inline-block">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-sm">
                  Класс угрозы: <span className="font-bold text-red-400">{object.threat_class}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Description */}
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 border border-red-900/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-red-500">ОПИСАНИЕ</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{object.description}</p>
          </div>

          {/* Containment */}
          {object.containment && (
            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 border border-red-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-red-500">УСЛОВИЯ СОДЕРЖАНИЯ</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{object.containment}</p>
            </div>
          )}

          {/* Threat Level */}
          {object.threat_level && (
            <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 border border-red-900/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-red-500">УРОВЕНЬ УГРОЗЫ</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{object.threat_level}</p>
            </div>
          )}

          {/* Secret Data */}
          {object.secret_data && (
            <div className="bg-gradient-to-br from-red-900/20 to-black/50 rounded-lg p-6 border border-red-600/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-bold text-red-400">СЕКРЕТНЫЕ ДАННЫЕ</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{object.secret_data}</p>
              <div className="mt-4 text-xs text-red-400/70 font-mono">
                [ДОСТУП ОГРАНИЧЕН - УРОВЕНЬ ДОПУСКА 4+]
              </div>
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="mt-8 bg-black/30 border border-red-900/30 rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm font-mono">
            Эта информация является конфиденциальной. Несанкционированный доступ карается в соответствии с протоколом ES.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailPage;
