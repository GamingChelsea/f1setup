"use client";
import React, { useEffect, useState } from "react";
import { TRACKS } from '@deltazeroproduction/f1-udp-parser/build/src/constants/tracks';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Prompt from './prompt'
import ReactMarkdown from "react-markdown";

export default function Page() {
  const [currentSetup, setCurrentSetup] = useState<any>(null);
  const [currentsession, setCurrentSession] = useState<any>(null);
  const [localData, setLocalData] = useState<any>(null);
  const [localParticipants, setLocalParticipants] = useState<any>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [lastPitStopStatus, setLastPitStopStatus] = useState<number | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<string |any>(null);

  const [output, setOutput] = useState<string>("Go Ingame!");
  const [feedback, setFeedback] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    setIsLoading(true);
    setOutput("Loading...");
    try {
      const prompt = Prompt(
        teamInfo.name,
        TRACKS[currentsession?.m_trackId]?.name,
        JSON.stringify(currentSetup, null, 2),
        feedback,
        currentsession.m_airTemperature,
        currentsession.m_trackTemperature,
        weatherInfo
      );
      const response = await fetch('/api/generate', {
        method: 'Post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ body: prompt })
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
      } else {
        setOutput(data.error);
      }
    } catch (error) {
      console.log(error);
      setOutput("Fehler beim Generieren.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.key === "localData") {
        setLastPitStopStatus(msg.data.m_pitStatus);
        setLocalData(msg.data);
      }
      else if (msg.key === "setup"){
        setCurrentSetup(msg.data);
      }
      else if (msg.key === "session"){
        setCurrentSession(msg.data);
      }
      else if (msg.key === "localParticipants"){
        setLocalParticipants(msg.data)
      }
      else if (msg.key === "TeamInfo"){
        setTeamInfo(msg.data)
      }
      else if (msg.key === "weather"){
        setWeatherInfo(msg.data)
      }
    };
    return () => ws.close();
  }, []);

  return (
    <main className="w-full h-full self-center flex flex-col content-center items-center justify-center">
      <div className="gap-4 flex justify-evenly content-center items-center m-2">
        <h1 className="text-bold text-red-600 text-2xl">F1 Telemetrie Live</h1>
 
        <Tooltip >
          <TooltipTrigger className="flex flex-row gap-1.5 anchor-element">
            <p className="flex wrap-normal"> Pit Status: </p>
            <p >{lastPitStopStatus !== null ? lastPitStopStatus : "No Data"}</p>
          </TooltipTrigger>
          <TooltipContent className="text-gray-500">0: Outside 1:Box</TooltipContent>
        </Tooltip>

        <div className="flex flex-row gap-1.5">
          <p className="flex wrap-normal">Team: </p>
          <p style={{ color: teamInfo?.color }}> {teamInfo?.name ? teamInfo?.name : "No Data"} </p>
        </div>

        <Tooltip>
          <TooltipTrigger className="flex flex-row gap-1.5">
            <p className="flex wrap-normal">Track: </p>
            <p> {TRACKS[currentsession?.m_trackId]?.name ? TRACKS[currentsession?.m_trackId]?.name : "No Data" } </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>Weather: {weatherInfo ? weatherInfo : "No Data"}° </p>
            <p>Track Temperature: {currentsession?.m_trackTemperature ? currentsession.m_trackTemperature : "No Data"}° </p>
            <p>Air Temperature: {currentsession?.m_airTemperature ? currentsession.m_airTemperature : "No Data"}° </p>

          </TooltipContent>
        </Tooltip>
      </div>
      
      <Card className=" w-3/6 my-2 p-3">
        <ReactMarkdown>
          {output}
        </ReactMarkdown>
      </Card>
      <div className=" flex flex-row gap-3 w-2/4 h-1/4 items-center mb-5">
        <Textarea
          placeholder="Your Feedback"
          className="w-full h-full"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <Button
          onClick={generateText}
          size={"lg"}
          disabled={
            isLoading ||
            !teamInfo?.name ||
            teamInfo?.name === "No Data"
          }
        >
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>



      {/*
      Show Setup and local Data
       
       <pre style={{ maxHeight: 300, overflow: "auto", background: "#222", color: "#fff", padding: 16 }}>
         {currentSetup ? JSON.stringify(currentSetup, null, 2) : "Warte auf Daten..."}
       </pre>
       <pre style={{ maxHeight: 300, overflow: "auto", background: "#222", color: "#fff", padding: 16 }}>
         {localData ? JSON.stringify(localData, null, 2) : "Warte auf Daten..."}
       </pre>
      */}     
        
    </main>
  );
}