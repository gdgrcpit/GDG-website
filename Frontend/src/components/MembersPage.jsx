import { useState } from "react";
import MembersCard from "./MembersCard"; // Import the MembersCard component
import chapter2Members from "../data/chapter2Members";
import chapter1Members from "../data/chapter1Members";

export default function MembersPage() {
  const [selectedChapter, setSelectedChapter] = useState("chapter1");
  const [selectedTeam, setSelectedTeam] = useState("All");

  const handleChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedTeam("All");
  };

  const currentMembers =
    selectedChapter === "chapter1" ? chapter1Members : chapter2Members;

  const filteredMembers =
    selectedTeam === "All"
      ? currentMembers
      : currentMembers.filter((member) => member.teamName === selectedTeam);

  const teamNames = [
    "All",
    "Core Team",
    "Management Team",
    "Technical Team",
    "Design & Media Team",
    "PR / Communication Team",
    "Documentation Team",
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center mb-8">MEET THE TEAM</h2>

      {/* Chapter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleChapterChange("chapter1")}
          className={`px-6 py-2 rounded-lg ${
            selectedChapter === "chapter1"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-400 transition-colors`}
        >
          Chapter 1
        </button>
        <button
          onClick={() => handleChapterChange("chapter2")}
          className={`px-6 py-2 rounded-lg ${
            selectedChapter === "chapter2"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          } hover:bg-blue-400 transition-colors`}
        >
          Chapter 2
        </button>
      </div>

      {/* Team Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {teamNames.map((team) => (
          <button
            key={team}
            onClick={() => setSelectedTeam(team)}
            className={`px-4 py-2 rounded-full ${
              selectedTeam === team
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 transition-colors`}
          >
            {team}
          </button>
        ))}
      </div>

      {/* Render Filtered Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <MembersCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
