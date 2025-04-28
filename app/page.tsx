/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDUwftmydMVwR1RuMX8Qo6hyexQJ_wwCUk",
  authDomain: "inshoe-pressure-measurement.firebaseapp.com",
  databaseURL:
    "https://inshoe-pressure-measurement-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inshoe-pressure-measurement",
  storageBucket: "inshoe-pressure-measurement.firebasestorage.app",
  messagingSenderId: "970753443975",
  appId: "1:970753443975:web:21b777d1a7f69336e65022",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const FootPressureAnalyzer: React.FC = () => {
  const [liveData, setLiveData] = useState<any>({
    classification: "-",
    heatIndex: "-",
    humidity: "-",
    temperature: "-",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(database, "heatIndexData/readings");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLiveData({
          classification: data.classification,
          heatIndex: data.heatIndex,
          humidity: data.humidity,
          temperature: data.temperature,
        });
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const Skeleton = () => (
    <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full flex flex-col items-center space-y-6 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800">IOT Project</h2>
        <h2 className="text-2xl font-bold text-blue-600">Live Heat Index</h2>

        <div className="w-full grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between shadow-md">
            <p className="font-semibold text-gray-700">Temperature:</p>
            {loading ? (
              <Skeleton />
            ) : (
              <p className="font-bold text-blue-700">
                {liveData.temperature} °C
              </p>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-xl flex items-center justify-between shadow-md">
            <p className="font-semibold text-gray-700">Humidity:</p>
            {loading ? (
              <Skeleton />
            ) : (
              <p className="font-bold text-green-700">{liveData.humidity} %</p>
            )}
          </div>

          <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between shadow-md">
            <p className="font-semibold text-gray-700">Heat Index:</p>
            {loading ? (
              <Skeleton />
            ) : (
              <p className="font-bold text-red-700">{liveData.heatIndex} °F</p>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-xl flex items-center justify-between shadow-md">
            <p className="font-semibold text-gray-700">Classification:</p>
            {loading ? (
              <Skeleton />
            ) : (
              <p className="font-bold text-purple-700">
                {liveData.classification}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootPressureAnalyzer;
