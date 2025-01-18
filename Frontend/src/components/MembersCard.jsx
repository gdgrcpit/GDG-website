import { useState } from "react"; // Importing useState hook to manage the "Read More" functionality
import { Instagram, Github, Code, Coffee } from "lucide-react";

export default function MembersCard({ member }) {
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle bio expansion

  return (
    <div className="overflow-hidden group relative rounded-xl p-[2px] animate-gradient bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#34A853] to-[#FBBC04] hover:shadow-xl transition-shadow duration-300">
      <div className="bg-white rounded-[10px] overflow-hidden">
        <div className="p-0">
          <div className="relative">
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-11%20at%2014.35.05_1325c2a8.jpg-FZb3WcMf5TuG6E77myuS8IRwMVaKYO.jpeg")`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
            </div>

            <div className="absolute left-1/2 -bottom-20 -translate-x-1/2">
              <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-24 pb-6 px-6 max-h-[400px] overflow-hidden ">
            <h3 className="font-semibold text-xl mb-1 text-center">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-2 text-center">
              {member.role}
            </p>
            <p className="text-xs uppercase text-[#4285F4] font-bold tracking-wide mb-4 text-center">
              {member.teamName}
            </p>

            <p className="text-sm text-muted-foreground mb-6 text-center">
              {member.bio.length > 60
                ? member.bio.slice(0, 60) + "..."
                : member.bio}
            </p>

            {/* Bio Section with Read More Feature */}
            {/* <p className="text-sm text-muted-foreground mb-4 text-center">
              {isExpanded ? member.bio : `${member.bio.slice(0, 60)}...`}

              <button
                onClick={() => setIsExpanded(!isExpanded)} // Toggle state on click
                className="text-blue-600 font-semibold ml-2 hover:underline"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </p> */}

            <div className="flex justify-center gap-4 mb-6">
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-white text-[#4285F4] border border-[#4285F4] hover:bg-blue-50 transition-colors"
              >
                Connect
              </a>
              {member.portfolio && (
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full bg-white text-[#4285F4] border border-[#4285F4] hover:bg-blue-50 transition-colors"
                >
                  Portfolio
                </a>
              )}
            </div>

            <div className="flex justify-center gap-6 text-muted-foreground mt-4">
              <a
                href={member.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E4405F] transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#181717] transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href={member.socialLinks.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFA116] transition-colors"
              >
                <Code className="w-6 h-6" />
              </a>
              <a
                href={member.socialLinks.codechef}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5B4638] transition-colors"
              >
                <Coffee className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
